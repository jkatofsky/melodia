import React, { Component } from 'react';
import { MdSkipNext, MdDelete } from 'react-icons/md';

import RoomContext from '../../pages/Room/context.js';
import './style.css';

// so we can get the context through props in componentDidUpdate
const withContext = Wrapped => props => (
    <RoomContext.Consumer>
        {value => <Wrapped {...props} context={value} />}
    </RoomContext.Consumer>
);

const Player = withContext(class extends Component {

    song = (queue) => queue.length > 0 ? queue[0] : null;

    playNextSong = () => {
        const { emitData, queue } = this.props.context;
        if (queue.length > 1)
            emitData('play-song', 1)
        else
            emitData('remove-song', 0)
    }

    // TODO: test the song-changing stuff in componenentDidMount and componentDidUpdate

    componentDidMount() {
        const { queue } = this.props.context;
        const song = this.song(queue);

        if (song) {
            this.audioSource.src = song.source;
            this.audio.load();
        }
    }

    componentDidUpdate(prevProps) {
        const prevContext = prevProps.context;
        const { emitData, needPlaybackStateFor, playbackStateResponded,
            queue, isPlaying, lastSeekedTime } = this.props.context;

        if (needPlaybackStateFor !== prevContext.needPlaybackStateFor) {
            emitData('playback-state-response', needPlaybackStateFor, !this.audio.paused, this.audio.currentTime)
            playbackStateResponded()
        }

        const song = this.song(queue);

        if (!song) {
            this.audioSource.src = "";
            this.audio.load();
        } else if ((!prevContext.song) || (prevContext.song.api_id !== song.api_id)) {
            this.audioSource.src = song.source;
            this.audio.load();
        }
        if (prevContext.isPlaying !== isPlaying) {
            if (isPlaying) this.audio.play();
            else this.audio.pause()
        }
        if (lastSeekedTime && prevContext.lastSeekedTime !== lastSeekedTime) {
            this.audio.currentTime = lastSeekedTime;
        }
    }

    render() {

        const { queue, emitData, isSourceOfTruth } = this.props.context;
        const song = this.song(queue);

        return <>
            <div className='song-player-info'>
                {!song ?
                    <p className='notice'>No song playing</p>
                    : <>
                        <button className='button skip-button' onClick={this.playNextSong}>
                            {!queue.length > 1 ?
                                <MdSkipNext className='icon' size={20} />
                                : <MdDelete className='icon' size={20} />
                            }
                        </button>
                        <h2><i>{song.title}</i></h2>
                        <h4>{song.artist}&nbsp;&mdash;&nbsp;{song.album}</h4>
                        <img src={song.cover_big} alt="" />
                    </>
                }
            </div>
            {/* TODO: seems to be an error where the audio stream istelf rejects my requests...? */}
            <div className='song-player'>
                <audio id='audio' controls ref={ref => this.audio = ref}
                    onPlay={() => emitData('set-playing', true)}
                    onPause={() => emitData('set-playing', false)}
                    onSeeked={() => emitData('change-seek-time', this.audio.currentTime)}
                    onEnded={() => {
                        if (isSourceOfTruth)
                            this.playNextSong()
                    }}>
                    <source id='audio-source' src="" type='audio/mp3' ref={ref => this.audioSource = ref} />
                </audio>
            </div>
        </>;
    }
})

export default Player;