import React, { Component } from 'react';
import { SkipNext, Delete } from '@material-ui/icons';

import RoomContext from '../../pages/Room/context.js';
import './style.css';

class Player extends Component {

    constructor(props) {
        super(props);
        this.state = { externalPlaystateEvent: false };
    }

    song = (queue) => queue.length > 0 ? queue[0] : null;

    playNextSong = () => {
        const { emitData, queue } = this.props.context;
        if (queue.length > 1)
            emitData('play-song', 1)
        else
            emitData('remove-song', 0)
    }

    componentDidMount() {
        const { queue, lastSyncedPlaybackTime, isPlaying } = this.props.context;
        const song = this.song(queue);

        if (song) {
            this.onExternalSetSource(song.source);
            if (lastSyncedPlaybackTime) this.onExternalSeek(lastSyncedPlaybackTime);
            if (isPlaying) this.onExternalSetIsPlaying(true);
        }
    }

    componentDidUpdate(prevProps) {
        const prevContext = prevProps.context;
        const { emitData, sidAwaitingState, onPlaybackStateResponded,
            queue, isPlaying, lastSyncedPlaybackTime } = this.props.context;

        if (sidAwaitingState && sidAwaitingState !== prevContext.sidAwaitingState) {
            emitData('playback-state-response', sidAwaitingState, !this.audio.paused, this.audio.currentTime)
            onPlaybackStateResponded()
        }

        const prevSong = this.song(prevContext.queue);
        const song = this.song(queue);

        if (!song) {
            this.onExternalSetSource("");
        } else if ((!prevSong) || (prevSong.api_id !== song.api_id)) {
            this.onExternalSetSource(song.source);
        }

        if (prevContext.isPlaying !== isPlaying) {
            this.onExternalSetIsPlaying(isPlaying);
        }

        if (lastSyncedPlaybackTime && prevContext.lastSyncedPlaybackTime !== lastSyncedPlaybackTime) {
            this.onExternalSeek(lastSyncedPlaybackTime);
        }

    }

    onExternalSetSource = (source) => {
        this.audioSource.src = source;
        this.audio.load();
    }

    onExternalSeek = (time) => {
        this.setState({ externalPlaystateEvent: true })
        this.audio.currentTime = time;
    }

    onExternalSetIsPlaying = (isPlaying) => {
        this.setState({ externalPlaystateEvent: true });
        if (isPlaying) this.audio.play();
        else this.audio.pause()
    }

    //so onPlay/onSeek won't emit when client recieves programmatic updates in componentDidUpdate
    emitOnlyHumanEvents = (...args) => {
        const { externalPlaystateEvent } = this.state;
        const { emitData } = this.props.context;
        if (!externalPlaystateEvent) emitData(...args);
        else this.setState({ externalPlaystateEvent: false })
    }

    render() {

        const { queue, isSourceOfTruth } = this.props.context;
        const song = this.song(queue);

        return <>
            <div className='song-player-info'>
                {!song ?
                    <p className='notice'>No song playing</p>
                    : <>
                        <button className='button skip-button' onClick={this.playNextSong}>
                            {queue.length > 1 ?
                                <SkipNext />
                                : <Delete />
                            }
                        </button>
                        <h2><i>{song.title}</i></h2>
                        <h4>{song.artist}&nbsp;&mdash;&nbsp;{song.album}</h4>
                        <img src={song.cover_big} alt="" />
                    </>
                }
            </div>
            <div className='song-player'>
                <audio controls ref={ref => this.audio = ref}
                    onPlay={() => {
                        this.emitOnlyHumanEvents('set-playing', true);
                    }}
                    onPause={() => {
                        this.emitOnlyHumanEvents('set-playing', false);
                    }}
                    onSeeked={() => {
                        this.emitOnlyHumanEvents('seek', this.audio.currentTime)
                    }}
                    onEnded={() => {
                        if (isSourceOfTruth)
                            this.playNextSong()
                    }}>
                    <source src="" type='audio/mp3' ref={ref => this.audioSource = ref} />
                </audio>
            </div>
        </>;
    }
}

//we access context through the props so we can make use of componentDidMount
export default React.forwardRef((props, ref) => (
    <RoomContext.Consumer>
        {context => <Player {...props} context={context} ref={ref} />}
    </RoomContext.Consumer>
));
