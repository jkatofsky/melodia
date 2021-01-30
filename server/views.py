from .app import app, socketio
from .models import *
from .api import *

from flask import render_template, request
from flask_socketio import join_room, leave_room, emit

@app.route('/')
def homepage():
    return render_template('index.html')

@app.route('/<room_id>')
def room(room_id):
    return app.send_static_file('index.html')

#TODO: implement all of the routes below
# https://flask-socketio.readthedocs.io/en/latest/

@app.route('/create-room')
def create_room():
    room = Room()
    return {'room_id': str(room.id)}

@app.route('/search/<query>')
def search_songs(query):
    search_results = search_songs(query)
    #TODO: return the relevant info for results
    pass

#TODO: delete the room when no one's in it

#TODO: need to figure out how to stream song!!!
# https://stackoverflow.com/questions/23396575/node-socket-live-audio-stream-broadcast/26029102#26029102 but for flask
# get the preview file from the API?
# how does this fit into the way I'm deciding currently playing song by the 0-th index?

def broadcast_state(room_id):
    data = {}
    #TODO: JSONify all of the relevant state
    emit('state-update', data, to=room_id, json=True)


@socketio.on('join')
def on_join(room_id):
    join_room(room_id)
    broadcast_state(request.sid) #to only get information for joining user on join


@socketio.on('leave')
def on_leave(room_id):
    leave_room(room_id)


@socketio.on('toggle-pause')
def toggle_pause(room_id):
    room: Room = Room.objects.get_or_404(id=room_id)
    room.is_playing = not room.is_playing
    room.save()

    broadcast_state(room_id)


@socketio.on('play-song')
def play_song(room_id, at_index):
    #TODO: update queue with song-id playing
    broadcast_state(room_id)


@socketio.on('queue-song')
def queue_song(room_id, song_id):
    #TODO: update queue with song-id added at index
    broadcast_state(room_id)


@socketio.on('remove-song')
def remove_song(room_id, at_index):
    #TODO: update queue with song at index removed
    broadcast_state(room_id)


@socketio.on('move-song')
def move_song(room_id, from_index, to_index):
    #TODO: update queue with song-id moved to_index
    broadcast_state(room_id)