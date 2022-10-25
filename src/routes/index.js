import React from 'react';
import { useRoutes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Root from './Root';
// All layouts/containers
import DefaultLayout from '../layouts/Default';
import VerticalLayout from '../layouts/Vertical';
import JoinGame from '../pages/game/JoinGame';
import Game from '../pages/game/Game';
import Games from '../pages/game/Games';
import Chat from '../pages/game/Chat';
import Login from '../pages/account/Login';
import Logout from '../pages/account/Logout';
import Register from '../pages/account/Register';
import ForgetPassword from '../pages/account/ForgetPassword';
import NewGame from '../pages/game/NewGame';



const AllRoutes = () => {
 
  let Layout = VerticalLayout;

  return useRoutes([
    { path: '/', element: <Root /> },
    {
      // public routes
      path: '/',
      element: <DefaultLayout />,
      children: [
        {
          path: 'account',
          children: [
            { path: 'login', element: <Login/> },
            { path: 'logout', element: <Logout/> },
            { path: 'register', element: <Register/> },            
            { path: 'forget-password', element: <ForgetPassword/> },            
          ],
        }
      ],
    },
    {
      // auth protected routes
      path: '/',
      element: <PrivateRoute roles={'Admin'} component={Layout} />,
      children: [
        {
          path: 'games',          
          element: <PrivateRoute roles={'Admin'} component={Games} />,
        },
        {
          path: 'joingame/:code',          
          element: <PrivateRoute roles={'Admin'} component={JoinGame} />,
        },
        {
          path: 'game/:code',          
          element: <PrivateRoute roles={'Admin'} component={Game} />,
        },
        {
          path: 'chat/:code',          
          element: <PrivateRoute roles={'Admin'} component={Chat} />,
        },     
        {
          path: 'newgame',          
          element: <PrivateRoute roles={'Admin'} component={NewGame} />,
        },        
        
      ],
    },
  ]);
};

export { AllRoutes };
