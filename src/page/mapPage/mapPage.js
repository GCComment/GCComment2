import { GMWindow } from "../../helper/gmWindow.js";
import { waitForPropOfObject } from "../../helper/wait.js";
import { addGccMenu, setMap } from "./mapHelper/mapDraw.js";

const getMapInstance = () => {
    // @ts-ignore
    return GMWindow.MapSettings.Map;
};

export const gccommentOnMapPage = () => {
    waitForPropOfObject("L.Map", GMWindow, () => {
        setMap(getMapInstance());
        addGccMenu();
    });
};
