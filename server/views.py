from .app import app, socketio
from .models import get_search_results, get_song, Queue

import bson
from flask import render_template, request, jsonify
from flask_socketio import join_room, leave_room, emit


@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/room/<room_id>')
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
 
@socketio.on('join')
def on_join(room_id):
    if not bson.objectid.ObjectId.is_valid(room_id):
        emit('state-update', False, room=request.sid)
        return
    
    join_room(room_id)

    queue: Queue = Queue.objects.get_or_404(pk=room_id)

    emit('update-songs', queue.songs, room=request.sid)



@socketio.on('leave')
def on_leave(room_id):
    leave_room(room_id)


@socketio.on('play-song')
def play_song(room_id, at_index):
    queue: Queue = Queue.objects.get_or_404(pk=room_id)
    queue.songs = queue.songs[at_index:]
    queue.save()

    emit('update-songs', queue.songs, room=room_id, include_self=True)


@socketio.on('queue-song')
def queue_song(room_id, song_id):
    queue: Queue = Queue.objects.get_or_404(pk=room_id)

    song_data = get_song(song_id)

    queue.songs.append(song_data)
    queue.save()

    emit('update-songs', queue.songs, room=room_id, include_self=True)


@socketio.on('remove-song')
def remove_song(room_id, at_index):
    queue: Queue = Queue.objects.get_or_404(pk=room_id)
    queue.songs.pop(at_index)
    queue.save()

    emit('update-songs', queue.songs, room=room_id, include_self=True)

