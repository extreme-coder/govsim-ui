// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// actions
import {
    changeLayoutColor,
    changeSidebarType,
} from '../../redux/actions';

// constants
import * as layoutConstants from '../../constants/layout';

// components

import LayoutColor from './LayoutColor';


const ThemeCustomizer = (): React$Element<React$FragmentType> => {
    const dispatch = useDispatch();

    const { layoutColor, layoutType, layoutWidth, leftSideBarType, leftSideBarTheme } = useSelector((state) => ({
        layoutColor: state.theme.Layout.layoutColor,
        layoutType: state.theme.Layout.layoutType,
        layoutWidth: state.theme.Layout.layoutWidth,
        leftSideBarTheme: state.theme.Layout.leftSideBarTheme,
        leftSideBarType: state.theme.Layout.leftSideBarType,
    }));

    const [disableLayoutWidth, setDisableLayoutWidth] = useState(false);
    const [disableSidebarTheme, setDisableSidebarTheme] = useState(false);
    const [disableSidebarType, setDisableSidebarType] = useState(false);

    /**
     * change state based on props changes
     */
    const _loadStateFromProps = useCallback(() => {
        setDisableLayoutWidth(
            layoutType !== layoutConstants.LAYOUT_DETACHED && layoutType !== layoutConstants.LAYOUT_FULL
        );

        setDisableSidebarTheme(
            layoutType !== layoutConstants.LAYOUT_HORIZONTAL && layoutType !== layoutConstants.LAYOUT_DETACHED
        );
        setDisableSidebarType(layoutType !== layoutConstants.LAYOUT_HORIZONTAL);
    }, [layoutType]);

    useEffect(() => {
        _loadStateFromProps();
    }, [_loadStateFromProps]);

   
    /**
     * Change the layout color
     */
    const changeLayoutColorScheme = (value: any) => {
        var mode = value;
        switch (mode) {
            case 'dark':
                dispatch(changeLayoutColor(layoutConstants.LAYOUT_COLOR_DARK));
                break;
            default:
                dispatch(changeLayoutColor(layoutConstants.LAYOUT_COLOR_LIGHT));
                break;
        }
    };

   

    
    /**
     * Change the leftsiderbar type
     */
    const changeLeftSiderbarType = (value: any) => {
        var type = value;
        switch (type) {
            case 'condensed':
                dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED));
                break;
            case 'scrollable':
                dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_SCROLLABLE));
                break;
            default:
                dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_FIXED));
                break;
        }
    };

 

    return (
        <React.Fragment>
            <div className="p-3">                                               
                <LayoutColor
                    changeLayoutColorScheme={changeLayoutColorScheme}
                    layoutColor={layoutColor}
                    layoutConstants={layoutConstants}
                />                           
            </div>
        </React.Fragment>
    );
};

export default ThemeCustomizer;
