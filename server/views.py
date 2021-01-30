from .app import app, socketio
from .models import *
from .api import *

import bson
from flask import render_template, request, jsonify
from flask_socketio import join_room, leave_room, emit


@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/<room_id>')
def room(room_id):
    return app.send_static_file('index.html')


@app.route('/api/create-room')
def create_room():
    queue: Queue = Queue.objects.create()
    return {'room_id': str(queue.id)}


@app.route('/api/search/<query>')
def search_songs(query):
    return jsonify({'results': get_search_results(query)})

#TODO: delete the room when no one's in it

#TODO: need to figure out how to stream song!!!
# https://stackoverflow.com/questions/23396575/node-socket-live-audio-stream-broadcast/26029102#26029102 but for flask
# get the preview file from the API?
# how does this fit into the way I'm deciding currently playing song by the 0-th index?

#TODO off-by-one error with deleting songs: clicking on i-th song deletes i-1-th

get_song_list = lambda queue : [song.api_data for song in queue.songs]


@socketio.on('join')
def on_join(room_id):
    if not bson.objectid.ObjectId.is_valid(room_id):
        emit('state-update', False, room=request.sid)
        return
    
    join_room(room_id)

    queue: Queue = Queue.objects.get_or_404(pk=room_id)

    emit('state-update', 
            {'isPlaying': queue.is_playing,
            'songs': get_song_list(queue)},
            room=request.sid)


@socketio.on('leave')
def on_leave(room_id):
    leave_room(room_id)


@socketio.on('toggle-pause')
def toggle_pause(room_id):
    queue: Queue = Queue.objects.get_or_404(pk=room_id)
    queue.is_playing = not queue.is_playing
    queue.save()

    emit('state-update', 
        {'isPlaying': queue.is_playing},
        room=room_id, include_self=True)


@socketio.on('play-song')
def play_song(room_id, at_index):
    queue: Queue = Queue.objects.get_or_404(pk=room_id)
    queue.songs = queue.songs[at_index:]
    queue.save()

    emit('state-update', 
        {'songs': get_song_list(queue)},
        room=room_id, include_self=True)


@socketio.on('queue-song')
def queue_song(room_id, song_id):
    queue: Queue = Queue.objects.get_or_404(pk=room_id)

    song_data = get_song(song_id)
    song: Song = Song.objects.create(api_data=song_data)
    song.save()

    queue.songs.append(song)
    queue.save()

    emit('state-update', 
        {'songs': get_song_list(queue)},
        to=room_id, include_self=True)


@socketio.on('remove-song')
def remove_song(room_id, at_index):
    queue: Queue = Queue.objects.get_or_404(pk=room_id)
    song = queue.songs.pop(at_index + 1)
    song.delete()
    queue.save()

    emit('state-update', 
        {'songs': get_song_list(queue)},
        room=room_id, include_self=True)


@socketio.on('move-song')
def move_song(room_id, from_index, to_index):
    queue: Queue = Queue.objects.get_or_404(pk=room_id)
    queue.songs.insert(to_index, queue.songs.pop(from_index))
    queue.save()

    emit('state-update', 
        {'songs': get_song_list(queue)},
        room=room_id, include_self=True)