import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


import Header from './components/Header';
import Landing from './pages/Landing';
import Room from './pages/Room';

import './App.css';


const App = () => {
    return <>
        <Header />
        <Router>
            <Switch>
                <Route exact path="/">
                    <Landing />
                </Route>
                <Route path="/room/:id">
                    <Room />
                </Route>
            </Switch>
        </Router>
    </>
}

export default App;