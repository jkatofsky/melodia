import React, { Component } from 'react';
import { io } from "socket.io-client";
import { Container, Row, Col } from 'react-grid-system';

import './App.css';
import Search from './components/Search'
import Player from './components/Player';
import Queue from './components/Queue';
import Header from './components/Header';
import { SERVER_URL } from './util/api.js';

class App extends Component {
    constructor(props) {
        super(props);

        const url = window.location.pathname;
        this.roomID = url.substring(url.lastIndexOf('/') + 1);

        this.state = {
            socket: null,
            isSourceOfTruth: false,
            queue: [],
            lastUpdatedPlaybackTime: 0,
            isPlaying: false
        }
    }

    componentDidMount() {
        const socket = io(SERVER_URL, { transports: ['websocket'] });
        socket.on('connect', () => {
            socket.emit('join', this.roomID);
        });
        socket.on('get-room-state', (roomState) => {
            //TODO: diff these things to reduce unecessary re-renders
            console.log(roomState)
            this.setState({
                isSourceOfTruth: roomState.is_source_of_truth,
                queue: roomState.queue,
                lastUpdatedPlaybackTime: roomState.last_updated_playback_time,
                isPlaying: roomState.is_playing
            })
        })
        socket.on('play-pause-toggled', () => {
            this.setState(state => ({ isPlaying: !state.isPlaying }));
        })
        socket.on('playback-time-changed', (newTime) => {
            this.setState({ lastUpdatedPlaybackTime: newTime });
        })
        socket.on('song-played', (atIndex) => {
            const { queue } = this.state;
            this.setState({ queue: queue.slice(atIndex) });
        })
        socket.on('song-queued', (song) => {
            const { queue } = this.state;
            queue.push(song);
            this.setState({ queue });
        })
        socket.on('song-removed', (atIndex) => {
            const { queue } = this.state;
            queue.splice(atIndex, 1);
            this.setState({ queue });
        })
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

    playNextSong = () => {
        const { queue } = this.state;
        if (queue.length > 1) this.emitData('play-song', 1)
        else this.emitData('remove-song', 0)
    }

    render() {

        const { isSourceOfTruth, socket, queue, isPlaying, lastUpdatedPlaybackTime } = this.state;

        return <>
            <Header />
            <Container>
                <Row>
                    <Col lg={4}>
                        <div className='section'>
                            <Search onQueueSong={(songID) => this.emitData('queue-song', songID)} />
                        </div>
                    </Col>

                    <Col lg={4}>
                        <div className='section'>
                            <Player roomID={this.roomID}
                                socket={socket}
                                song={queue.length > 0 ? queue[0] : null}
                                isPlaying={isPlaying}
                                lastUpdatedPlaybackTime={lastUpdatedPlaybackTime}
                                emptyQueue={queue.length <= 1}
                                onTogglePlayPause={() => this.emitData('toggle-play-pause')}
                                onPlaybackTimeChange={(newTime) => {
                                    if (newTime !== lastUpdatedPlaybackTime)
                                        this.emitData('change-playback-time', newTime)
                                }}
                                onSongSkip={this.playNextSong}
                                onSongFinish={() => {
                                    if (isSourceOfTruth) {
                                        this.playNextSong()
                                    }
                                }} />
                        </div>
                    </Col>

                    <Col lg={4}>
                        <div className='section'>
                            <Queue songs={queue.slice(1)}
                                onPlaySong={(atIndex) =>
                                    this.emitData('play-song', atIndex + 1)}
                                onRemoveSong={(atIndex) =>
                                    this.emitData('remove-song', atIndex + 1)} />
                        </div>
                    </Col>

                </Row>
            </Container>
        </>;
    }
}

export default App;
