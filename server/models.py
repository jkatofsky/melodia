from flask_mongoengine import MongoEngine

#TODO: configure this to use my MongoDB Atlas cluster
# make an ENV - will also be useful for whatever music API we land on
db = MongoEngine()

class Room(db.Document):
    is_playing = db.BooleanField()

class Song(db.Document):
    api_id = db.StringField()
    name = db.StringField()
    artist = db.StringField()
    album = db.StringField()
    cover_art_url = db.URLField()

class Queue(db.Document):
    room = db.ReferenceField(Room)
    songs = db.ListField(db.ReferenceField(Song), default=list)