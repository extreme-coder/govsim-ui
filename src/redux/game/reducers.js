// @flow
import { GameActionTypes } from './constants';


const INIT_STATE = {
  country: null,
  message: {show:false}
};


const Game = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GameActionTypes.CHANGE_GAME:
      return {
        ...state,
        country: action.payload,
      };
    case GameActionTypes.CHANGE_PARTY:
      return {
        ...state,
        party: action.payload,
      };
    case GameActionTypes.SHOW_ALERT:
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
};

export default Game;
