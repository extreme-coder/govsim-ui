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
import Chat from './components/Chat.jsx';
import withRouter from './components/withRouter.js';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';
import useLocalStorage from './hooks/useLocalStorage.js';

const AppRoutes = () => {
    const [user, setUser] = useLocalStorage('user')

    return (    
        <Routes>        
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />            
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute isAllowed={!!user} />}>
                <Route path="/game/:code" element={<Game />} />
                <Route path="/joingame/:code" element={<JoinGame />} />
                <Route path="/newgame" element={<NewGame />} />
                <Route path="/games" element={<Games />} />
                <Route path="/chat/:code" element={<Chat />} />
            </Route>
        </Routes>
    )
}
export default withRouter(AppRoutes)