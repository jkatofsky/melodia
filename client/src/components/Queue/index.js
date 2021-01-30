import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Queue extends Component {
    render() {
        const { songs, onPlaySong, onMoveSong, onRemoveSong } = this.props;
        return <>
            <h4>Queue</h4>
            {songs.length > 0 ?
                songs.map((song, index) =>
                    <p key={index} onClick={() => { onRemoveSong(index) }}>
                        {song.title}
                    </p>)
                :
                // TODO: default behaviour
                <></>}
        </>;
    }
}

Queue.propTypes = {
    songs: PropTypes.array,
    onPlaySong: PropTypes.func.isRequired,
    onMoveSong: PropTypes.func.isRequired,
    onRemoveSong: PropTypes.func.isRequired,
}

export default Queue;