from .app import socketio
from .models import Room, save_song_to_db

import json
from flask_socketio import emit

# TODO: for remove and play, delete songs from the DB!

@socketio.on('set-playing')
def on_toggle_play(room_id, is_playing):
    room: Room = Room.objects.get_or_404(pk=room_id)

    room.is_playing = is_playing
    room.save()

    emit('playing-set', room.is_playing, room=room_id, include_self=True)


@socketio.on('seek-time')
def on_change_playback_time(room_id, new_time):
    room: Room = Room.objects.get_or_404(pk=room_id)

    room.last_seeked_time = new_time
    room.save()

    emit('time-seeked', new_time, room=room_id, include_self=True)


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
