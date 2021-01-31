import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SongCard from '../SongCard';
import { MdDelete, MdPlayArrow } from 'react-icons/md';



class Queue extends Component {
    render() {
        const { songs, onPlaySong, onRemoveSong } = this.props;
        return <>
            <h2><u>Up Next</u></h2>
            <div className='songs-wrapper'>
                {songs.length > 0 ?
                    songs.map((song, index) =>
                        <SongCard key={index} song={song} buttons={
                            <>
                                <button onClick={() => onPlaySong(index)} className='button'>
                                    <MdPlayArrow className='icon' size={15} />
                                </button>
                                <button onClick={() => onRemoveSong(index)} className='button'>
                                    <MdDelete className='icon' size={15} />
                                </button>
                            </>
                        } />)
                    :
                    <p className='notice'>No songs yet</p>
                }
            </div>
        </>;
    }
}

Queue.propTypes = {
    songs: PropTypes.array,
    onPlaySong: PropTypes.func.isRequired,
    onRemoveSong: PropTypes.func.isRequired,
}

export default Queue;