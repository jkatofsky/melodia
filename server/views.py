from .app import app, socketio
from .models import *

import json
from mongoengine.queryset.visitor import Q
from flask import request, jsonify
from flask_socketio import join_room, leave_room, emit


# serve the react frontend
@app.route('/')
def homepage():
    return app.send_static_file('index.html')


@app.route('/api/create-room')
def create_room():
    room: Room = Room()
    room.save()
    return {'room_id': str(room.id)}


@app.route('/api/search/<query>')
def search_songs(query):
    return jsonify({'results': get_search_results(query)})


# these three events need to handle assigning the source of truth and getting new joins up to date with the playback state

@socketio.on('join')
def on_join(room_id):
    room: Room = Room.objects.get_or_404(pk=room_id)

    if not room.source_of_truth_sid:
        room.source_of_truth_sid = request.sid
        emit('notify-as-source-of-truth', room=request.sid)
        emit('get-room-state', room_state_dict(room), room=request.sid)
    else:
        room.other_participant_sids.append(request.sid)
        emit('playback-state-request', room=room.source_of_truth_sid)

    join_room(room_id)
    room.save()


def on_leave_or_disconnect(room_id, sid):
    room: Room = Room.objects.get_or_404(pk=room_id)

    if sid == room.source_of_truth_sid:
        if len(room.other_participant_sids) == 0:
            room.source_of_truth_sid = None
            room.is_playing = False
        else:
            room.source_of_truth_sid = room.other_participant_sids.pop(0)
            socketio.emit('notify-as-source-of-truth', room=room.source_of_truth_sid)
    else:
        room.other_participant_sids.remove(sid)

    room.save()


@socketio.on('leave')
def on_leave(room_id):
    on_leave_or_disconnect(room_id, request.sid)
    leave_room(room_id)


@socketio.on('disconnect')
def on_disconnect():
    room_id = Room.objects.get(Q(source_of_truth_sid=request.sid)|Q(other_participant_sids=request.sid)).id
    on_leave_or_disconnect(room_id, request.sid)


@socketio.on('playback-state-response')
def on_playback_state_response(room_id, is_playing, playback_time):
    room: Room = Room.objects.get_or_404(pk=room_id)

    room.is_playing = is_playing
    room.last_updated_playback_time = playback_time
    room.save()
    
    emit('get-room-state', room_state_dict(room), room=room_id, include_self=True)


# the below are client-agnostic events, broadcast back to everyone in the room

@socketio.on('toggle-play-pause')
def on_toggle_play(room_id):
    room: Room = Room.objects.get_or_404(pk=room_id)

    room.is_playing = not room.is_playing
    room.save()

    emit('play-pause-toggled', room=room_id, include_self=True)


@socketio.on('change-playback-time')
def on_change_playback_time(room_id, new_time):
    room: Room = Room.objects.get_or_404(pk=room_id)

    room.last_updated_playback_time = new_time
    room.save()

    emit('playback-time-changed', new_time, room=room_id, include_self=True)


@socketio.on('play-song')
def play_song(room_id, at_index):
    room: Room = Room.objects.get_or_404(pk=room_id)

    room.queue = room.queue[at_index:]
    room.save()

    emit('song-played', at_index, room=room_id, include_self=True)


@socketio.on('queue-song')
def queue_song(room_id, song_api_id):
    room: Room = Room.objects.get_or_404(pk=room_id)

    song = save_song_to_db(song_api_id)
    room.queue.append(song)
    room.save()

    emit('song-queued', json.loads(song.to_json()), room=room_id, include_self=True)


@socketio.on('remove-song')
def remove_song(room_id, at_index):
    room: Room = Room.objects.get_or_404(pk=room_id)
    
    room.queue.pop(at_index)
    room.save()

    emit('song-removed', at_index, room=room_id, include_self=True)
