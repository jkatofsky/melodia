from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_mongoengine import MongoEngine

app = Flask(__name__, template_folder="../homepage",
            static_folder='../client/build', static_url_path='/')

app.config.from_pyfile('config.py')

CORS(app)

db = MongoEngine()

db.init_app(app)

socketio = SocketIO(app, cors_allowed_origins="*")
