# Melodia

Passing the aux, virtually: a web app that enables real-time collaboration on a queue of music with your friends.

Started during the McHacks 8 hackathon, with further features in development.

Built with:

- [Flask](https://palletsprojects.com/p/flask/)
- [Flask-MongoEngine](http://docs.mongoengine.org/projects/flask-mongoengine/en/latest/)
- [flask-socketio](https://en.wikipedia.org/wiki/WebSocket)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [React](https://reactjs.org/)
- [Google App Engine](https://cloud.google.com/appengine)

## TODO

- [ ] prod bug where sometimes state isn't pushed to others in the room
- [ ] add clear search button
- [ ] revisit song playback syncing! a rough idea for how to maybe implement it:
  - one idea
    - download currently playing song file locally (& temporarily) to server
    - is_playing flag in `Queue`
    - `last_streamed_byte` in `Queue` -> updated when playback `Queue` is paused/moved?
    - websocket route that streams the song file, using `last_streamed_byte`, to all clients in room, if `is_playing`
  - another idea
    - on change of playback state (song time or play/pause), send event to server, begin client loading state, but use response event (sent to everyone in room) to update playback
    - on client join, server asks other clients (which client? all of them, averaged?) for their time. clients give their time and begin loading state, waiting for playback update event that's sent to everybody
  - like the above idea but with P2P stuff? Peer.js?
    - programattically assign a leader client that's a source of truth? how to change it when they leave?
  - inspiration can be found [here](https://stackoverflow.com/questions/23396575/node-socket-live-audio-stream-broadcast/26029102#26029102) and [here](https://stackoverflow.com/questions/56198688/how-to-synchronize-a-music-player-to-multiple-clients-in-nodejs) and [here](https://stackoverflow.com/questions/29066117/streaming-a-file-from-server-to-client-with-socket-io-stream)
- [ ] bring the homepage into the react app & use routing
- [ ] more informative loading state on client & request validation on server
- [ ] use material UI?
- [ ] use React context?
- [ ] delete room/Queue after everyone leaves? or after a period of time?
- [ ] fix homepage button spacing
- [ ] 'copy link to clipboard' and 'copy id to clipboard' buttons on room page
- [ ] 'go to homepage' button on room
- [ ] display # of people currently in room? room chat? naming of rooms/users? authentication?
- [ ] modal that provides more information about a given song?
- [ ] drag-and-drop song reordering
- [ ] fix the autoplay not working bug
