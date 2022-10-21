import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';


import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SideBar(props) {
  const {code} = props
  const navigate = useNavigate()

  return (
    <SideNav
    onSelect={(selected) => {
        // Add your code here
        console.log(selected)
        navigate(selected)
    }}
>
    <SideNav.Toggle />
    <SideNav.Nav defaultSelected="home">
        <NavItem eventKey="/games">
            <NavIcon>
                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
                Home
            </NavText>
        </NavItem>
        <NavItem eventKey="charts">
            <NavIcon>
                <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
                Charts
            </NavText>
            <NavItem eventKey={`/chat/${code}`}>
                <NavText>
                    Chat
                </NavText>
            </NavItem>
            <NavItem eventKey="charts/barchart">
                <NavText>
                    Bar Chart
                </NavText>
            </NavItem>
        </NavItem>
    </SideNav.Nav>
</SideNav>
  );
};