import React, { Component } from 'react';
import SongCard from '../SongCard';
import { MdDelete, MdPlayArrow } from 'react-icons/md';

import RoomContext from '../../pages/Room/context.js';

class Queue extends Component {

    static contextType = RoomContext;

    songs = (queue) => queue.length > 2 ? queue.slice(1) : null;

    render() {
        console.log(this.context);
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
                                    <MdPlayArrow className='icon' size={15} />
                                </button>
                                <button onClick={() => emitData('remove-song', index + 1)} className='button'>
                                    <MdDelete className='icon' size={15} />
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