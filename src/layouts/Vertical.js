// @flow
import React, { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';

// actions
import { changeSidebarType } from '../redux/actions';

// constants
import * as layoutConstants from '../constants/layout';

// components
import ThemeCustomizer from '../components/ThemeCustomizer/';

// utils
import { changeBodyAttribute } from '../utils';

// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const Topbar = React.lazy(() => import('./Topbar'));
const LeftSidebar = React.lazy(() => import('./LeftSidebar'));
const Footer = React.lazy(() => import('./Footer'));
const RightSidebar = React.lazy(() => import('./RightSidebar'));

const loading = () => <div className=""></div>;

type VerticalLayoutProps = {
    children?: any,
};

type VerticalLayoutState = {
    isMenuOpened?: boolean,
};

const VerticalLayout = ({ children }: VerticalLayoutProps, state: VerticalLayoutState): React$Element<any> => {
    const dispatch = useDispatch();

    const { layoutColor, leftSideBarTheme, leftSideBarType, layoutWidth } = useSelector((state) => ({
        layoutColor: state.theme.Layout.layoutColor,
        layoutWidth: state.theme.Layout.layoutWidth,
        leftSideBarTheme: state.theme.Layout.leftSideBarTheme,
        leftSideBarType: state.theme.Layout.leftSideBarType,
    }));

    const [isMenuOpened, setIsMenuOpened] = useState(false);

    /*
     * layout defaults
     */
    useEffect(() => {
        changeBodyAttribute('data-layout', layoutConstants.LAYOUT_VERTICAL);
    }, []);

    useEffect(() => {
        changeBodyAttribute('data-layout-color', layoutColor);
    }, [layoutColor]);

    useEffect(() => {
        changeBodyAttribute('data-layout-mode', layoutWidth);
    }, [layoutWidth]);

    useEffect(() => {
        changeBodyAttribute('data-leftbar-theme', leftSideBarTheme);
    }, [leftSideBarTheme]);

    useEffect(() => {
        changeBodyAttribute('data-leftbar-compact-mode', leftSideBarType);
    }, [leftSideBarType]);

    /**
     * Open the menu when having mobile screen
     */
    const openMenu = () => {
        setIsMenuOpened((prevState) => {
            setIsMenuOpened(!prevState);
        });

        if (document.body) {
            if (isMenuOpened) {
                document.body.classList.remove('sidebar-enable');
            } else {
                document.body.classList.add('sidebar-enable');
            }
        }
    };

    const updateDimensions = useCallback(() => {
        // activate the condensed sidebar if smaller devices like ipad or tablet
        if (window.innerWidth >= 768 && window.innerWidth <= 1028) {
            dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED));
        } else if (window.innerWidth > 1028) {
            dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_FIXED));
        }
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, [dispatch, updateDimensions]);

    const isCondensed = leftSideBarType === layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED;
    const isLight = leftSideBarTheme === layoutConstants.LEFT_SIDEBAR_THEME_LIGHT;

    return (
        <>
            <div className="wrapper">
                
                    <LeftSidebar isCondensed={isCondensed} isLight={isLight} hideUserProfile={true} />
                
                <div className="content-page">
                    <div className="content">
                        
                            <Topbar openLeftMenuCallBack={openMenu} hideLogo={true} />
                        
                        <Container fluid>
                            <Outlet />
                        </Container>
                    </div>

                    
                        <Footer />
                    
                </div>
            </div>

            
                <RightSidebar>
                    <ThemeCustomizer />
                </RightSidebar>
            
        </>
    );
};
export default VerticalLayout;
