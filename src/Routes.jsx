import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Logout from './components/Logout.jsx';
import Home from './components/Home.jsx';
import Game from './components/Game.jsx';
import Games from './components/Games.jsx';
import JoinGame from './components/JoinGame.jsx';
import NewGame from './components/NewGame.jsx'
import withRouter from './components/withRouter.js';

const AppRoutes = () => (
    <Routes>        
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/game/:code" element={<Game />} />
        <Route path="/joingame/:code" element={<JoinGame />} />
        <Route path="/newgame" element={<NewGame />} />
        <Route path="/games" element={<Games />} />
        <Route path="/" element={<Home />} />
    </Routes>
)

export default withRouter(AppRoutes)