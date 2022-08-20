import { GMWindow } from "../../helper/gmWindow.js";
import { log } from "../../helper/logger.js";
import { waitForPropOfObject } from "../../helper/wait.js";
import { CacheComment } from "./../../dataClasses/cacheComment";
import { addGccMenu, setMap } from "./mapHelper/mapDraw";
import { mapFinderHook } from "./mapHelper/newMapHook.js";

export const gccommentOnNewMapPage = () => {
    waitForPropOfObject("L.Map", GMWindow, () => {
        mapFinderHook((mapInstance) => {
            console.log(mapInstance._layers);
            setMap(mapInstance, onClickMarker);
            addGccMenu();
        });
    });
};

const findMarkerLayer = (map, latlng) => {
    var allMarkerLayer = null;
    for (var l_name in map._layers) {
        if (map._layers[l_name]["_eventParents"]) {
            allMarkerLayer = Object.values(
                map._layers[l_name]["_eventParents"]
            )[0];
            break;
        }
    }

    var minDist = 99999;
    var minMaker = null;

    for (var l_name in allMarkerLayer._layers) {
        if (map._layers[l_name]["_latlng"]) {
            const markerLatLng = map._layers[l_name]["_latlng"];
            const dist =
                Math.abs(markerLatLng["lat"] - latlng[0]) +
                Math.abs(markerLatLng["lng"] - latlng[1]);
            if (dist < minDist) {
                minDist = dist;
                minMaker = map._layers[l_name];
            }
        }
    }

    if (minDist > 0.0001) {
        return null;
    }

    return minMaker;
};

/**
 * @param {CacheComment} comment
 * @param {string} gccode
 */
function onClickMarker(comment, gccode, marker, map, leaflet) {
    var marker = findMarkerLayer(map, [comment.origlat, comment.origlng]);
    if (marker === null) {
        log(
            "info",
            `No cache marker found for: ${gccode} (maybe cache archived or currently selected?)`
        );
        return;
    }
    marker.fireEvent(
        "click",
        {
            latlng: [comment.origlat, comment.origlng]
        },
        true
    );
}
