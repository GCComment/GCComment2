import { GMWindow } from "../../helper/gmWindow.js";
import { waitForPropOfObject } from "../../helper/wait.js";
import { addGccMenu, setMap } from "./mapHelper/mapDraw.js";

const getMapInstance = () => {
    // @ts-ignore
    return GMWindow.MapSettings.Map;
};

export const gccommentOnMapPage = () => {
    waitForPropOfObject("L.Map", GMWindow, () => {
        setMap(getMapInstance(), onClickMarker);
        addGccMenu();
    });
};

function onClickMarker(comment, gccode, marker, map, leaflet) {
    var gcurl = "https://tiles01.geocaching.com/map/map.details?i=" + gccode;
    var success = (a) => {
        var b = "cd" + Math.ceil(9999999999999 * Math.random());
        var h = `<div id="${b}"></div>`;

        var popup = new leaflet.Popup({
            minWidth: 400,
            maxWidth: 400
        });

        popup.setContent(h);
        popup.setLatLng(marker.getLatLng());
        map.openPopup(popup);

        GMWindow.$("#" + b)
            .link(a, "#cachePopupTemplate")
            .delegate("a.prev-item", "click", (a) => {
                a.preventDefault();
                $(this).parents("div.map-item").hide().prev().show();
                return false;
            })
            .delegate("a.next-item", "click", (a) => {
                a.preventDefault();
                $(this).parents("div.map-item").hide().next().show();
                return false;
            });

        setTimeout(() => {
            popup._adjustPan();
        }, 100);
    };
    GM_xmlhttpRequest({
        method: "GET",
        url: gcurl,
        onload: (responseDetails) => {
            try {
                success(JSON.parse(responseDetails.responseText));
            } catch (JSONException) {
                log("error", "Could not load popup info: " + JSONException);
            }
        }
    });
}
