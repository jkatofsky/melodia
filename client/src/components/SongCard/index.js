import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

function SongCard(props) {

    const limitLength = (field) => field.length > 30 ? field.substring(0, 20) + "..." : field;

    const { song, buttons } = props;

    return <div className="song-card" >
        <div className="song-card-info">
            <img src={song.cover_small} alt="" />
            <div>
                <h5>{song.title}</h5>
                <p>{limitLength(song.title)}</p>
                <p>{song.artist}</p>
            </div>
        </div>
        {buttons &&
            <div className='song-card-buttons'>
                {buttons}
            </div>}
    </div>;
}

SongCard.propTypes = {
    song: PropTypes.object.isRequired,
    buttons: PropTypes.element
}

export default SongCard;