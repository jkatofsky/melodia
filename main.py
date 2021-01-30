from server.app import socketio, app

# TODO: figure out why the serving of both the react app and the homepage is 404-ing now...
# what changed???

if __name__ == "__main__":
    socketio.run(app, port=8000, debug=True)