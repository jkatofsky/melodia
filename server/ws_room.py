from .app import socketio
from .models import Room, get_song_document

import json
from flask_socketio import emit


@socketio.on('set-playing')
def on_toggle_play(room_id, is_playing):
    emit('playing-set', is_playing, room=room_id, include_self=False)

    room: Room = Room.objects.get_or_404(pk=room_id)
    room.is_playing = is_playing
    room.save()


@socketio.on('seek')
def on_change_last_synced_playback_time(room_id, new_time):
    emit('seeked', new_time, room=room_id, include_self=False)

    room: Room = Room.objects.get_or_404(pk=room_id)
    room.last_seeked_time = new_time
    room.save()


@socketio.on('play-song')
def play_song(room_id, at_index):
    emit('song-played', at_index, room=room_id, include_self=True)

    room: Room = Room.objects.get_or_404(pk=room_id)
    room.queue = room.queue[at_index:]
    room.save()


@socketio.on('queue-song')
def queue_song(room_id, song_api_id):
    song = get_song_document(song_api_id)
    emit('song-queued', json.loads(song.to_json()), room=room_id, include_self=True)

    room: Room = Room.objects.get_or_404(pk=room_id)
    room.queue.append(song)
    room.save()


@socketio.on('remove-song')
def remove_song(room_id, at_index):
    emit('song-removed', at_index, room=room_id, include_self=True)

    room: Room = Room.objects.get_or_404(pk=room_id)
    room.queue.pop(at_index)
    room.save()
