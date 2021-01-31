import React, { Component } from 'react';
import { io } from "socket.io-client";
import { Container, Row, Col } from 'react-grid-system';

import './App.css';
import Search from './components/Search'
import Player from './components/Player';
import Queue from './components/Queue';
import Header from './components/Header';
import { SERVER_URL } from './util/api.js';

// TODO: revisit whether or not I should have an explicit loading flag
// TODO: revisit how to render loading state

class App extends Component {
    constructor(props) {
        super(props);

        const url = window.location.pathname
        this.roomID = url.substring(url.lastIndexOf('/') + 1);

        this.state = {
            socket: null,
            validRoom: true,
            songs: []
        }
    }

    componentDidMount() {
        const socket = io(SERVER_URL, { transport: ['websocket'] });
        socket.on('connect', () => {
            socket.emit('join', this.roomID);
        });
        socket.on("update-songs", songs => {
            if (!songs) {
                this.setState({ validRoom: false });
                socket.disconnect();
                return;
            }
            this.setState({ songs })
        });
        this.setState({ socket });
    }

    componentWillUnmount() {
        const { socket } = this.state;
        socket.emit('leave', this.roomID);
        socket.disconnect();
    }

    emitData = (endpoint, ...args) => {
        const { socket } = this.state;
        socket.emit(endpoint, this.roomID, ...args);
    }

    render() {

        const { socket, validRoom, songs } = this.state;

        return <>
            <Header />
            {!socket ?
                <h3>Loading room...</h3>
                :
                !validRoom ?
                    <h3>Invalid room link!</h3>
                    : <Container>
                        <Row>

                            <Col lg={4}>
                                <div className='section'>
                                    <Search onQueueSong={(songID) => this.emitData('queue-song', songID)} />
                                </div>
                            </Col>

                            <Col lg={4}>
                                <div className='section'>
                                    <Player song={songs.length > 0 ? songs[0] : null}
                                        emptyQueue={songs.length <= 1}
                                        onSongSkip={() => songs.length > 1 ?
                                            this.emitData('play-song', 1) :
                                            this.emitData('remove-song', 0)} />
                                </div>
                            </Col>

                            <Col lg={4}>
                                <div className='section'>
                                    <Queue songs={songs.slice(1)}
                                        onPlaySong={(atIndex) =>
                                            this.emitData('play-song', atIndex + 1)}
                                        onRemoveSong={(atIndex) =>
                                            this.emitData('remove-song', atIndex + 1)} />
                                </div>
                            </Col>

                        </Row>
                    </Container>
            }
        </>;
    }
}

export default App;
