import React, { Component } from 'react';
import { SERVER_URL } from '../../util/api.js';
import { MdQueueMusic } from 'react-icons/md';

import RoomContext from '../../pages/Room/context.js';
import SongCard from '../SongCard';
import './style.css';

class Search extends Component {

    static contextType = RoomContext;

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            loading: false,
            typingTimeout: 0,
            songs: []
        }
    }

    searchSongs = async (query) => {
        this.setState({ loading: true });
        const response = await fetch(`${SERVER_URL}/api/search/${query}`,
            {
                mode: 'cors',
                headers: { 'Access-Control-Allow-Origin': '*' }
            });

        let songs;
        if (response.status !== 200) {
            songs = [];
        } else {
            const responseJSON = await response.json();
            songs = responseJSON['results'];
        }
        this.setState({
            loading: false,
            songs
        });
    }

    handleQueryChange = (event) => {
        const { typingTimeout } = this.state;
        const query = event.target.value;
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        this.setState({
            query, typingTimeout: setTimeout(() => this.searchSongs(query), 300)
        });
    }

    render() {

        const { emitData } = this.context;
        const { loading, songs } = this.state;


        return <>
            <h2><u>Search</u></h2>
            <input placeholder='Search songs'
                type="text" onChange={this.handleQueryChange} />

            <div className='songs-wrapper'>
                {!loading ?
                    songs.map(song => (
                        <SongCard key={song.api_id} song={song} buttons={
                            <button onClick={() => emitData('queue-song', song.api_id)} className='button'>
                                <MdQueueMusic className='icon' size={30} />
                            </button>
                        } />
                    ))
                    : <p className='notice'>Loading...</p>}
            </div>
        </>
    }
}

export default Search;