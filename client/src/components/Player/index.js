import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdSkipNext, MdDelete } from 'react-icons/md';


import './style.css';

class Player extends Component {
    render() {
        const { songs, onSongSkip } = this.props;
        return <>
            <div className='song-player-info'>
                {!songs.length > 0 ?
                    <p className='notice'>No song playing</p>
                    : <>
                        <button className='button skip-button' onClick={onSongSkip}>
                            {!songs.length > 1 ?
                                <MdSkipNext className='icon' />
                                : <MdDelete className='icon' />}
                        </button>
                        <h2><i>{songs[0].title}</i></h2>
                        <h4>{songs[0].artist.name}&nbsp;&mdash;&nbsp;{songs[0].album.title}</h4>
                        <img src={songs[0].album.cover_big} alt="" />
                    </>
                }
            </div>
            {/* TODO: fix this!!! why is it sometimes not enabled */}
            <div className='song-player'>
                <audio controls>
                    <source src={songs.length > 0 ? songs[0].preview : null} />
                </audio>
            </div>
        </>;
    }
}



Player.propTypes = {
    songs: PropTypes.array,
    onSongSkip: PropTypes.func.isRequired
}

export default Player;