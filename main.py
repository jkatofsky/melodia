from server.app import socketio, app
import server.views

if __name__ == "__main__":
    socketio.run(app, port=5000, debug=True)