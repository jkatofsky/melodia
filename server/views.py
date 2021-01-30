from .app import app, socketio
from flask import render_template

@app.route('/')
def homepage():
    return render_template('index.html')

@app.route('/<room_id>')
def room(room_id):
    return app.send_static_file('index.html')

#TODO: implement all of the routes below
# https://flask-socketio.readthedocs.io/en/latest/
# use rooms! https://flask-socketio.readthedocs.io/en/latest/#rooms (join for get-songs)

@app.route('/create-room')
def create_room():
    #creates relevant objects and returns room ID
    pass

@app.route('/suggest/<query>')
def suggest_songs(query):
    #calls the song api and returns song suggestions
    pass

#TODO: delete the room when no one's in it
#TODO: need to figure out how to synchronize the song streaming:
# - the timing of auto-changing songs when a song finishes playing
# - getting the correct time in the song on join

@socketio.on('get-songs')
def get_songs(room_id):
    #gets the current songs for id and returns them
    pass

@socketio.on('toggle-pause')
def toggle_pause(room_id):
    #plays/pauses song for all clients
    pass

@socketio.on('add-song')
def add_song(room_id, song_id, index):
    #update and return queue to all clients with song-id added at index
    pass

@socketio.on('play-song')
def play_song(room_id, song_id):
    #update and return queue to all clients with song-id playing
    pass

@socketio.on('remove-song')
def remove_song(room_id, song_id):
    #update and return queue to all clients with song-id removed
    pass

@socketio.on('move-song')
def move_song(room_id, song_id, to_index):
    #update and return queue to all clients with song-id moved to_index
    pass