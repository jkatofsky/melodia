import React, { Component } from 'react';
import { apiCall } from '../../util/api.js';
import { Link, Redirect } from 'react-router-dom';

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

        const { roomIDInput, createdRoomID } = this.state;

        return <>
            {createdRoomID &&
                <Redirect to={`/room/${createdRoomID}`} />
            }
            <button className="btn1" onClick={this.createRoom}>Create Room</button>
            <br />
            <input type="text" placeholder="Enter Room ID"
                className="txtbox" value={this.state.inputValue}
                onChange={evt => this.updateInputValue(evt)} />
            <Link to={`/room/${roomIDInput}`}>
                <button className="btn2">Join Room</button>
            </Link>
        </>
    }
}

export default Landing;