import $ from "jquery";
import { GMWindow } from "../../helper/gmWindow.js";
import { waitForPropOfObject } from "../../helper/wait.js";
import { mapFinderHook } from "./mapHelper/newMapHook.js";
import { addGccMenu, setMap } from "./mapHelper/mapDraw";

export const gccommentOnNewMapPage = () => {
    waitForPropOfObject("L.Map", GMWindow, () => {
        mapFinderHook((mapInstance) => {
            setMap(mapInstance);
            addGccMenu();
        });
    });
};
