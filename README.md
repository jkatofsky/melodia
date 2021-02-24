# Melodia

Passing the aux, virtually: a web app that enables real-time collaboration on a queue of music with your friends.

Started during the McHacks 8 hackathon, with further features in development.

Built with:

- [Flask](https://palletsprojects.com/p/flask/)
- [MongoDB](https://www.mongodb.com/) ([MongoEngine](http://mongoengine.org/))
- [socketio](https://socket.io/)
- [React](https://reactjs.org/) ([Material UI](https://material-ui.com/))
- [Google App Engine](https://cloud.google.com/appengine)

## TODO

For sure:

- [ ] check if Room rendered as a redirect from Landing; if not, require interaction with HTML before rendering room so song can autoplay
- [ ] more informative loading state on client & request validation on server
- [ ] continue adopting Material UI
- [ ] add clear search button
- [ ] fix homepage button spacing
- [ ] 'copy link to clipboard' and 'copy id to clipboard' buttons on room page
- [ ] 'go to homepage' button on room

Possible bells and whistles:

- [ ] display # of people currently in room? room chat? naming of rooms/users? authentication?
- [ ] modal that provides more information about a given song?
- [ ] drag-and-drop song reordering?
