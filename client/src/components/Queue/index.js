import React, { Component } from 'react';
import SongCard from '../SongCard';
import { PlayArrow, Delete } from '@material-ui/icons';

import RoomContext from '../../pages/Room/context.js';

class Queue extends Component {

    static contextType = RoomContext;

    songs = (queue) => queue.length > 1 ? queue.slice(1) : null;

    render() {
        const { queue, emitData } = this.context;

        const songs = this.songs(queue);

        return <>
            <h2><u>Up Next</u></h2>
            <div className='songs-wrapper'>
                {songs ?
                    songs.map((song, index) =>
                        <SongCard key={index} song={song} buttons={
                            <>
                                <button onClick={() => emitData('play-song', index + 1)} className='button'>
                                    <PlayArrow className='icon' size={15} />
                                </button>
                                <button onClick={() => emitData('remove-song', index + 1)} className='button'>
                                    <Delete className='icon' size={15} />
                                </button>
                            </>
                        } />)
                    :
                    <p className='notice'>No songs yet</p>
                }
            </div>
        </>

    }
}


export default Queue;