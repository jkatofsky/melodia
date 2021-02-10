from .app import app
from .models import Room, get_search_results

from flask import jsonify


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
