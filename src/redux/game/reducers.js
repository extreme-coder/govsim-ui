// @flow
import { GameActionTypes } from './constants';


const INIT_STATE = {
  country: null,
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
    default:
      return state;
  }
};

export default Game;
