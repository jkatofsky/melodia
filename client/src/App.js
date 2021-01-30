import React, { Component } from 'react';
import { io } from "socket.io-client";

import './App.css';
import Search from './components/Search'
import Player from './components/Player';
import Queue from './components/Queue'
import { SERVER_URL } from './util/api.js';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            socket: null,
            songs: [],
            isPlaying: false
        }
    }

    componentDidMount() {
        const url = window.location.pathname
        const roomID = url.substring(url.lastIndexOf('/') + 1);

        const socket = io(SERVER_URL);
        socket.emit('join', roomID)
        socket.on("state-update", data => {
            this.setState({ isPlaying: data.isPlaying, songs: data.songs })
        });

        this.setState({ socket });
    }

    componentWillUnmount() {
        // TODO: get rid of connection
    }

    emitData = (endpoint, ...args) => {
        const { socket } = this.state;
        socket.emit(endpoint, args);
    }

    render() {

        const { songs, isPlaying } = this.state;

        // TODO: implement all of the below components
        return (<>
            <Search onQueueSong={(songID) => this.emitData('queue-song', songID)} />

            <Player song={songs.length > 0 && songs[0]}
                isPlaying={isPlaying}
                onTogglePause={() => this.emitData('toggle-pause')}
                onSongSkip={() => this.emitData('play-song', songs[1].id)} />

            <Queue songs={songs}
                onPlaySong={(atIndex) => this.emitData('play-song', atIndex)}
                onMoveSong={(fromIndex, toIndex) =>
                    this.emitData('move-song', fromIndex, toIndex)}
                onRemoveSong={(atIndex) => this.emitData('remove-song', atIndex)} />
        </>)
    }
}

export default App;
