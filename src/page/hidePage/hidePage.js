import { GMWindow } from '../../helper/gmWindow.js';
import { waitForPropOfObject } from '../../helper/wait.js';
import { addGccMenuHide, setMap } from '../mapPage/mapHelper/mapDraw.js';

const getMapInstance = () =>{
    // @ts-ignore
    return GMWindow.map;
};

export const gccommentOnHidePage = () => {
    waitForPropOfObject("L.Map", GMWindow, () => {
        waitForPropOfObject("map", GMWindow, () => {
            setTimeout(() =>{
            setMap(getMapInstance());
            addGccMenuHide();
            },100);
        });
    });
};