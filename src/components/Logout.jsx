import React from 'react';
import {Navigate} from 'react-router-dom'

class Logout extends React.Component {  
    componentDidMount() {   
        localStorage.removeItem('user');
    }
    render() {
        return (
            <Navigate to="/home" />
        )
    }
}
export default Logout