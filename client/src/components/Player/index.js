import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Player extends Component {
    render() {
        const { song, isPlaying, onTogglePause, onSongSkip } = this.props;
        return <>
            <h4>Player</h4>
            {song ?
                <p>{song.title}</p>
                :
                // TODO: default behaviour
                <></>}
        </>;
    }
}



Player.propTypes = {
    song: PropTypes.object,
    isPlaying: PropTypes.bool.isRequired,
    onTogglePause: PropTypes.func.isRequired,
    onSongSkip: PropTypes.func.isRequired
}

export default Player;