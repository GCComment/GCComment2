import { GMWindow } from "../../helper/gmWindow.js";
import { waitForPropOfObject } from "../../helper/wait.js";
import { addGccMenu, setMap } from "./mapHelper/mapDraw";
import { mapFinderHook } from "./mapHelper/newMapHook.js";

export const gccommentOnNewMapPage = () => {
    waitForPropOfObject("L.Map", GMWindow, () => {
        mapFinderHook((mapInstance) => {
            setMap(mapInstance);
            addGccMenu();
        });
    });
};
