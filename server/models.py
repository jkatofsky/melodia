from flask_mongoengine import MongoEngine


db = MongoEngine()


class Song(db.Document):
    api_data = db.DictField() #TODO: save only the fields that I want instead?

class Queue(db.Document):
    songs = db.ListField(db.ReferenceField(Song), default=list)

class Room(db.Document):
    is_playing = db.BooleanField(default=False)
    queue = db.ReferenceField(Queue)
