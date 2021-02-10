from requests import api
from .app import db
import requests
import json

API_URL = 'https://api.deezer.com'



def api_song_to_schema(api_song, search_result=False):
    ret = {'api_id': str(api_song['id']), 'title': api_song['title'], 'artist': api_song['artist']['name'], \
            'album':api_song['album']['title'], 'cover_small':api_song['album']['cover_small'] }

    if not search_result:
        ret['source'] = api_song['preview']
        ret['cover_big'] = api_song['album']['cover_big']

    return ret


def get_search_results(query):
    response = requests.get(f'{API_URL}/search?output=json&limit=10&q={query}').json()
    return [api_song_to_schema(api_song, search_result=True) for api_song in response['data']]



class Song(db.Document):
    api_id = db.StringField()
    title = db.StringField()
    artist = db.StringField()
    album = db.StringField()
    source = db.URLField()
    cover_small = db.URLField()
    cover_big = db.URLField()


def save_song_to_db(song_api_id):
    api_song = requests.get(f'{API_URL}/track/{song_api_id}').json()
    song = Song(**api_song_to_schema(api_song))
    song.save()
    return song


class Room(db.Document):
    queue = db.ListField(db.ReferenceField(Song), default=list)
    source_of_truth_sid = db.StringField()
    other_participant_sids = db.ListField(db.StringField(), default=list)
    is_playing = db.BooleanField(default=False)
    last_updated_playback_time = db.FloatField(default=0)


def room_state_dict(room: Room, to_source_of_truth=False):
    ret = {'queue' : [json.loads(song.to_json()) for song in room.queue], 'is_playing': room.is_playing, 'playback_time': room.last_updated_playback_time}
    if to_source_of_truth:
        ret['is_source_of_truth'] = True
    return ret