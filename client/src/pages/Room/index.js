import React, { Component } from 'react';
import { io } from "socket.io-client";
import { Grid } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { Link, withRouter } from 'react-router-dom';

import RoomContext from './context.js';
import Search from '../../components/Search'
import Player from '../../components/Player';
import Queue from '../../components/Queue';
import { SERVER_URL } from '../../util/api.js';
import './style.css';

class Room extends Component {
    constructor(props) {
        super(props);

        this.roomID = this.props.match.params.id;

        this.initialRoomContext = {
            emitData: this.emitData,
            isSourceOfTruth: false,
            queue: [],
            lastSyncedPlaybackTime: 0,
            isPlaying: false,
            playbackStateResponded: this.playbackStateResponded,
            sidAwaitingState: null,
        }

        this.state = {
            loading: true,
            loadingMessage: 'Connecting to server...',
            ...this.initialRoomContext
        }
    }

    //all handlers happen here
    //all emits (other than join/leave) happen in child components

    componentDidMount() {
        const socket = io(SERVER_URL, { transports: ['websocket'] });
        this.socket = socket;

        socket.on('connect', () => {
            this.setState({ loadingMessage: 'Joining room...' })
            this.emitData('join')
        });

        socket.on('get-room-state', (roomState) => {
            this.setState({
                loadingMessage: '',
                loading: false,
                queue: roomState.queue,
                lastSyncedPlaybackTime: roomState.last_synced_playback_time,
                isPlaying: roomState.is_playing
            })
        })

        socket.on('playback-state-request', (sidAwaitingState) => {
            if (this.state.isSourceOfTruth)
                this.setState({ sidAwaitingState });
        })

        socket.on('disconnect', () => {
            this.disconnectSocket()
        })

        socket.on('notify-as-source-of-truth', () => {
            this.setState({ isSourceOfTruth: true });
        })

        socket.on('playing-set', (isPlaying) => {
            this.setState({ isPlaying });
        })

        socket.on('seeked', (seekedTime) => {
            this.setState({ lastSyncedPlaybackTime: seekedTime });
        })

        socket.on('song-played', (atIndex) => {
            const { queue } = this.state;
            this.setState({ queue: queue.slice(atIndex) });
        })

        socket.on('song-queued', (song) => {
            const { queue } = this.state;
            const _queue = [...queue];
            _queue.push(song);
            this.setState({ queue: _queue });
        })

        socket.on('song-removed', (atIndex) => {
            const { queue } = this.state;
            queue.splice(atIndex, 1);
            this.setState({ queue });
        })
    }

    componentWillUnmount() {
        this.disconnectSocket()
    }

    componentDidCatch(error, errorInfo) {
        this.disconnectSocket()
        console.error(errorInfo)
    }

    getContextValue = () => {
        const value = {};
        Object.keys(this.initialRoomContext).map(key =>
            value[key] = this.state[key])
        return value;
    }

    emitData = (endpoint, ...args) => {
        if (this.socket)
            this.socket.emit(endpoint, this.roomID, ...args);
    }

    playbackStateResponded = () => {
        this.setState({ sidAwaitingState: null });
    }

    disconnectSocket = () => {
        this.emitData('leave')
        this.socket.disconnect();
    }

    render() {

        const { loading, loadingMessage } = this.state;

        return <>

            <Link to='/'>
                <button className="button home-button"><HomeIcon /></button>
            </Link>

            {loading ?
                <h2>{loadingMessage}</h2>
                :
                <RoomContext.Provider value={this.getContextValue()}>

                    <button className='button clipboard-button'
                        onClick={() => { navigator.clipboard.writeText(this.roomID) }}>
                        <FileCopyIcon />&nbsp;
                        Room ID
                    </button>

                    <Grid container direction="row"
                        justify="center" alignItems="flex-start">
                        <Grid item md={4} xs={12}>
                            <div className='section'>
                                <Search />
                            </div>
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <div className='section'>
                                <Player />
                            </div>
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <div className='section'>
                                <Queue />
                            </div>
                        </Grid>
                    </Grid>

                </RoomContext.Provider>
            }
        </>;
    }
}

export default withRouter(Room);
