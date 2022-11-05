// @flow
import { GameActionTypes } from './constants';

export const changeGame = (country) => ({
    type: GameActionTypes.CHANGE_GAME,
    payload: country,
});

export const changeParty = (party) => ({
  type: GameActionTypes.CHANGE_PARTY,
  payload: party,
});

export const showAlert = (message) => ({
  type: GameActionTypes.SHOW_ALERT,
  payload: message,
});

