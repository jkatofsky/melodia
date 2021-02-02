import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdSkipNext, MdDelete } from 'react-icons/md';


import './style.css';

class Player extends Component {


    componentDidUpdate(prevProps) {
        const { song } = this.props;

        if (!song) {
            this.audioSource.src = "";
            this.audio.load();
        }
        else if ((!prevProps.song) || (prevProps.song.id !== song.id)) {
            this.audioSource.src = song.preview;
            this.audio.load();
            this.audio.play();
        }

    }

    render() {

        const { song, onSongSkip, emptyQueue } = this.props;

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
                        <h4>{song.artist.name}&nbsp;&mdash;&nbsp;{song.album.title}</h4>
                        <img src={song.album.cover_big} alt="" />
                    </>
                }
            </div>
            <div className='song-player'>
                <audio id='audio' controls ref={ref => this.audio = ref}>
                    <source id='audio-source' src="" type='audio/mp3' ref={ref => this.audioSource = ref} />
                </audio>
            </div>
        </>;
    }
}



Player.propTypes = {
    songs: PropTypes.array,
    emptyQueue: PropTypes.bool.isRequired,
    onSongSkip: PropTypes.func.isRequired
}

export default Player;