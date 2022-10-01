import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Logout from './Logout.jsx';
import withRouter from './components/withRouter.js';

const AppRoutes = () => (
    <Routes>
        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/logout" element={<Logout />} />
    </Routes>
)

export default withRouter(AppRoutes)