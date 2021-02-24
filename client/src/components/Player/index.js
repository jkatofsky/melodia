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
        const { queue, lastSeekedTime } = this.props.context;
        const song = this.song(queue);

        if (song) {
            this.audioSource.src = song.source;
            this.audio.load();
            if (lastSeekedTime) this.audio.currentTime = lastSeekedTime;
        }
    }

    componentDidUpdate(prevProps) {
        const prevContext = prevProps.context;
        const { emitData, sidAwaitingState, playbackStateResponded,
            queue, isPlaying, lastSeekedTime } = this.props.context;

        if (sidAwaitingState && sidAwaitingState !== prevContext.sidAwaitingState) {
            emitData('playback-state-response', sidAwaitingState, !this.audio.paused, this.audio.currentTime)
            playbackStateResponded()
        }

        const prevSong = this.song(prevContext.queue);
        const song = this.song(queue);

        if (!song) {
            this.audioSource.src = "";
            this.audio.load();
        } else if ((!prevSong) || (prevSong.api_id !== song.api_id)) {
            this.audioSource.src = song.source;
            this.audio.load();
        }

        if (prevContext.isPlaying !== isPlaying) {
            this.setState({ externalPlaystateEvent: true })
            if (isPlaying) this.audio.play();
            else this.audio.pause()
        }
        if (lastSeekedTime && prevContext.lastSeekedTime !== lastSeekedTime) {
            this.setState({ externalPlaystateEvent: true })
            this.audio.currentTime = lastSeekedTime;
        }
    }

    //so onPlay/onSeek won't emit when client recieves programmatic updates in componentDidUpdate
    emitOnlyHumanEvents = (...args) => {
        const { externalPlaystateEvent } = this.state;
        const { emitData } = this.props.context;
        if (!externalPlaystateEvent) emitData(...args);
        if (externalPlaystateEvent) this.setState({ externalPlaystateEvent: false });
    }

    render() {

        const { queue, isSourceOfTruth } = this.props.context;
        const song = this.song(queue);

        return <>
            <div className='song-player-info'>
                {!song ?
                    <p className='notice'>No song playing</p>
                    : <>
                        <button className='icon-button skip-button' onClick={this.playNextSong}>
                            {queue.length > 1 ?
                                <SkipNext className='icon' size={20} />
                                : <Delete className='icon' size={20} />
                            }
                        </button>
                        <h2><i>{song.title}</i></h2>
                        <h4>{song.artist}&nbsp;&mdash;&nbsp;{song.album}</h4>
                        <img src={song.cover_big} alt="" />
                    </>
                }
            </div>
            <div className='song-player'>
                <audio id='audio' controls ref={ref => this.audio = ref}
                    onPlay={() => this.emitOnlyHumanEvents('set-playing', true)}
                    onPause={() => this.emitOnlyHumanEvents('set-playing', false)}
                    onSeeked={() => this.emitOnlyHumanEvents('seek', this.audio.currentTime)}
                    onEnded={() => {
                        if (isSourceOfTruth)
                            this.playNextSong()
                    }}>
                    <source id='audio-source' src="" type='audio/mp3' ref={ref => this.audioSource = ref} />
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
