from server.app import socketio, app
import server.views

if __name__ == "__main__":
    socketio.run(app, debug=True)