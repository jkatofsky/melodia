from .app import db
import requests

API_URL = 'https://api.deezer.com'


def get_search_results(query):
    response = requests.get(f'{API_URL}/search?output=json&limit=10&q={query}')
    json = response.json()
    return json['data']


def get_song(song_id):
    response = requests.get(f'{API_URL}/track/{song_id}')
    return response.json()


class Queue(db.Document):
    songs = db.ListField(db.DictField(), default=list)
