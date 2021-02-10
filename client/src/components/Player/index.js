import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdSkipNext, MdDelete } from 'react-icons/md';


import './style.css';

class Player extends Component {

    componentDidUpdate(prevProps) {
        const { socket, roomID, song, isPlaying, lastUpdatedPlaybackTime } = this.props;

        //only define define this event when we get the socket
        if (prevProps.socket !== socket) {
            socket.on('playback-state-request', () => {
                socket.emit('playback-state-response', roomID, !this.audio.paused, this.audio.currentTime)
            })
        }

        if (!song) {
            this.audioSource.src = "";
            this.audio.load();
        }
        else if ((!prevProps.song) || (prevProps.song.id !== song.id)) {
            this.audioSource.src = song.preview;
            this.audio.load();
            this.audio.play();
        } else if (prevProps.isPlaying !== isPlaying) {
            if (isPlaying) this.audio.play();
            else this.audio.pause()
        } else if (prevProps.lastUpdatedPlaybackTime !== lastUpdatedPlaybackTime) {
            this.audio.currentTime = lastUpdatedPlaybackTime;
        }
    }

    render() {

        const { song, onSongSkip, emptyQueue, onTogglePlayPause, onPlaybackTimeChange, onSongFinish } = this.props;

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
                    onPause={() => onTogglePlayPause()}
                    onTimeUpdate={() => onPlaybackTimeChange(this.audio.currentTime)}
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
    onTogglePlayPause: PropTypes.func.isRequired,
    onPlaybackTimeChange: PropTypes.func.isRequired,
    onSongSkip: PropTypes.func.isRequired,
    onSongFinish: PropTypes.func.isRequired
}

export default Player;