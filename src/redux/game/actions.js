// @flow
import { GameActionTypes } from './constants';

export const changeGame = (code) => ({
    type: GameActionTypes.CHANGE_GAME,
    payload: code,
});

