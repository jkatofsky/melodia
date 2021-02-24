import React, { Component } from 'react';
import { apiCall } from '../../util/api.js';
import { Link, Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';

import './style.css';

class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roomIDInput: '',
            creatingRoom: false,
            createdRoomID: null
        };
    }

    updateInputValue = (evt) => {
        this.setState({
            roomIDInput: evt.target.value
        });
    }

    createRoom = async () => {
        this.setState({ creatingRoom: true });
        // TODO: what if no response?
        const createResponse = await apiCall(`create-room`);
        this.setState({ createdRoomID: createResponse['room_id'] });
    }


    render() {

        const { creatingRoom, roomIDInput, createdRoomID } = this.state;

        return <>
            {createdRoomID &&
                <Redirect to={`/room/${createdRoomID}`} />
            }
            <Grid container direction="row" justify="center" alignItems="center">
                <Grid item md={4} sm={8} xs={12}>{creatingRoom ?
                    <h2>Creating room...</h2>
                    :
                    <>
                        <button className="button landing-button" onClick={this.createRoom}>Create Room</button>
                        <br />
                        <input type="text" placeholder="Enter Room ID"
                            value={this.state.inputValue}
                            onChange={evt => this.updateInputValue(evt)} />
                        <Link to={`/room/${roomIDInput}`}>
                            <button className="button landing-button">Join Room</button>
                        </Link>
                    </>
                }</Grid>
            </Grid>
        </>
    }
}

export default Landing;