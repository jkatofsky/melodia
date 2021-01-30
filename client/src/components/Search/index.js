import React, { Component } from 'react';
import { SERVER_URL } from '../../util/api.js';
import PropTypes from 'prop-types';

class Search extends Component {

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
        const responseJSON = await response.json();
        this.setState({
            songs: responseJSON['results'],
            loading: false
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

        const { onQueueSong } = this.props;
        const { loading, songs } = this.state;

        return <>
            <h4>Search</h4>
            <input placeholder='Search songs'
                type="text" onChange={this.handleQueryChange} />

            {!loading ?
                songs.map(song => (
                    <div key={song.id} onClick={() => {
                        onQueueSong(song.id)
                    }}>
                        {song.title}
                    </div>
                ))
                : <>{/* TODO: render loading state */}</>}
        </>
    }
}

Search.propTypes = {
    onQueueSong: PropTypes.func.isRequired
}

export default Search;