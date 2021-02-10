from server.app import socketio, app
import server.views
import server.ws_clients
import server.ws_room

if __name__ == "__main__":
    socketio.run(app, debug=True)