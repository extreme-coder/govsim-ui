import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Logout from './Logout.jsx';
import Home from './components/Home.jsx';
import withRouter from './components/withRouter.js';

const AppRoutes = () => (
    <Routes>
        
        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Home />} />
    </Routes>
)

export default withRouter(AppRoutes)