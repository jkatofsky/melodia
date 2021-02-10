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

For sure:

- [ ] finish the implementation of my more ambitious syncing system
- [ ] use React context! state management is getting hairy
- [ ] bring the homepage into the react app & use routing
- [ ] more informative loading state on client & request validation on server
- [ ] use material UI!
- [ ] add clear search button
- [ ] fix homepage button spacing
- [ ] 'copy link to clipboard' and 'copy id to clipboard' buttons on room page
- [ ] 'go to homepage' button on room

Possible bells and whistles:

- [ ] display # of people currently in room? room chat? naming of rooms/users? authentication?
- [ ] modal that provides more information about a given song?
- [ ] drag-and-drop song reordering?
