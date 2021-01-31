import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdSkipNext, MdDelete } from 'react-icons/md';


import './style.css';

class Player extends Component {


    componentDidUpdate(prevProps, prevState) {
        const { song } = this.props;

        const audio = document.getElementById('audio');
        const audioSource = document.getElementById('audio-source');

        if (!song) {
            audioSource.src = "";
            audio.load();
        }
        else if ((!prevProps.song) || (prevProps.song.id !== song.id)) {
            audioSource.src = song.preview;
            audio.load();
            audio.play();
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
                <audio id='audio' controls>
                    <source id='audio-source' src="" type='audio/mp3' />
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