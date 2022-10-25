// @flow
import { GameActionTypes } from './constants';


const INIT_STATE = {
    code: '',    
};


const Game = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GameActionTypes.CHANGE_GAME:
            return {
                ...state,
                code: action.payload,
            };        
        default:
            return state;
    }
};

export default Game;
