# Melodia

Passing the aux, virtually: a web app that enables real-time collaboration on a queue of music with your friends.

Made in 36 hours for the McHacks 8 hackathon by Josh Katofsky and Adam Gmell.

Built with:

- [Flask](https://palletsprojects.com/p/flask/)
- [Flask-MongoEngine](http://docs.mongoengine.org/projects/flask-mongoengine/en/latest/)
- [flask-socketio](https://en.wikipedia.org/wiki/WebSocket)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [React](https://reactjs.org/)
- [Google App Engine](https://cloud.google.com/appengine)

## TODO

- [ ] fix the prod 400 bug!!!
- [ ] revisit song playback syncing! a rough idea for how to maybe implement it:
  - download currently playing song file locally (& temporarily) to server
  - is_playing flag in `Queue`
  - `last_streamed_byte` in `Queue` -> updated when `Queue` is paused?
  - websocket route that streams the song file, using `last_streamed_byte`, to all clients in room, if `is_playing`
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
