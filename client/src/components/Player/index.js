import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdSkipNext, MdDelete } from 'react-icons/md';


import './style.css';

class Player extends Component {

    componentDidMount() {
        const { socket, song } = this.props;
        if (socket) {
            this.setPlaybackEvents();
        }
        if (song) {
            this.audioSource.src = song.source;
            this.audio.load();
        }
    }

    componentDidUpdate(prevProps) {
        const { socket, song, isPlaying, lastUpdatedPlaybackTime } = this.props;

        if (prevProps.socket !== socket) {
            this.setPlaybackEvents();
        }

        if (!song) {
            this.audioSource.src = "";
            this.audio.load();
        } else if ((!prevProps.song) || (prevProps.song.api_id !== song.api_id)) {
            this.audioSource.src = song.source;
            this.audio.load();
        }
        if (prevProps.isPlaying !== isPlaying) {
            if (isPlaying) this.audio.play();
            else this.audio.pause()
        }
        if (lastUpdatedPlaybackTime && prevProps.lastUpdatedPlaybackTime !== lastUpdatedPlaybackTime) {
            this.audio.currentTime = lastUpdatedPlaybackTime;
        }
    }

    setPlaybackEvents = () => {
        const { socket, roomID } = this.props;
        socket.on('playback-state-request', (forSID) => {
            socket.emit('playback-state-response', roomID, forSID, !this.audio.paused, this.audio.currentTime)
        })
    }

    render() {

        const { song, onSongSkip, emptyQueue, onSetPlaying, onPlaybackTimeChange, onSongFinish } = this.props;

        return <>
            <div className='song-player-info'>
                {!song ?
                    <p className='notice'>No song playing</p>
                    : <>
                        <button className='button skip-button' onClick={onSongSkip}>
                            {!emptyQueue ?
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
            <div className='song-player'>
                <audio id='audio' controls ref={ref => this.audio = ref}
                    onPlay={() => onSetPlaying(true)}
                    onPause={() => onSetPlaying(false)}
                    onSeeked={() => onPlaybackTimeChange(this.audio.currentTime)}
                    onEnded={() => onSongFinish()}>
                    <source id='audio-source' src="" type='audio/mp3' ref={ref => this.audioSource = ref} />
                </audio>
            </div>
        </>;
    }
}



Player.propTypes = {
    socket: PropTypes.object.isRequired,
    roomID: PropTypes.string.isRequired,
    song: PropTypes.array,
    isPlaying: PropTypes.bool.isRequired,
    lastUpdatedPlaybackTime: PropTypes.number.isRequired,
    emptyQueue: PropTypes.bool.isRequired,
    onSetPlaying: PropTypes.func.isRequired,
    onPlaybackTimeChange: PropTypes.func.isRequired,
    onSongSkip: PropTypes.func.isRequired,
    onSongFinish: PropTypes.func.isRequired
}

export default Player;