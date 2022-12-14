import $ from "jquery";
import { html, render } from "lighterhtml";
import { COMPREFIX } from "../../../consts/general.js";
import {
    finaliconfound,
    finaliconsolved,
    finaliconunsolved,
    origfound,
    origsolved,
    origunsolved,
    state_found,
    state_solved,
    state_unsolved,
    waypointIcon
} from "../../../consts/icons.js";
import { lang } from "../../../consts/language/language";
import {
    AUTOMOVEMYSTERIESBETA,
    AUTOMOVEMYSTERIESBETAAREA,
    AUTOMOVEMYSTERIESBETAFOUND,
    AUTOMOVEMYSTERIESBETAHOME,
    AUTOMOVEMYSTERIESBETAINCLUDEWPT,
    AUTOMOVEMYSTERIESBETASOLVED,
    AUTOMOVEMYSTERIESBETAUNSOLVED
} from "../../../consts/preferences.js";
import { CacheComment } from "../../../dataClasses/cacheComment.js";
import { StateEnum } from "../../../dataClasses/stateEnum";
import { doLoadCommentFromGUID } from "../../../function/db.js";
import { parseCoordinates } from "../../../helper/coordinates.js";
import { GMWindow } from "../../../helper/gmWindow.js";
import { log } from "../../../helper/logger.js";
import { NewSlideMenu } from "../../../other/leafletMenu.js";
import { appendCheckBox } from "../../other/controls.js";
import { gccIcon } from "./../../../consts/icons";

/** @type {L.Map} */
var map = null;
/** @type {L} */
var leaflet = null;
/** @type {L.LayerGroup} */
var gccLayer = null;
var makerClickCallback = null;

export const setMap = (m, makerClick = null) => {
    map = m;
    // @ts-ignore
    leaflet = GMWindow.L;
    makerClickCallback = makerClick;
};

/**
 * Allows to set an own layer (optional).
 * @param {L.LayerGroup} layer
 */
export const setLayer = (layer) => {
    gccLayer = layer;
};

export const deleteAllGccMarkers = () => {
    if (gccLayer !== null) {
        map.removeLayer(gccLayer);
        gccLayer = null;
    }
    createGccLayerIfRequired();
};

const updateMoveMysteries = () => {
    deleteAllGccMarkers();
    if (!$(`#${AUTOMOVEMYSTERIESBETA}`).prop("checked")) {
        return;
    }

    var keys = GM_listValues();
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.indexOf(COMPREFIX) > -1) {
            var guid = key.substring(COMPREFIX.length, key.length);
            var comment = doLoadCommentFromGUID(guid);

            drawSingleCache(comment);
        }
    }
};

export const addGccMenu = () => {
    NewSlideMenu("", {
        iconImg: gccIcon,
        position: "topright",
        menuposition: "topright",
        marginvertical: "65"
    }).addTo(map);
    render(
        $(".leaflet-menu-contents")[0],
        html`
            <b>
                ${appendCheckBox(
                    AUTOMOVEMYSTERIESBETA,
                    lang.map_enablemm,
                    () => {
                        $("#mmSub").slideToggle();
                        updateMoveMysteries();
                    }
                )}
            </b>
            <div id="mmSub" style="display:none; padding: 0 15px;">
                <div id="mmSubCacheOptions">
                    ${appendCheckBox(
                        AUTOMOVEMYSTERIESBETASOLVED,
                        lang.type_solved,
                        updateMoveMysteries,
                        true,
                        state_solved
                    )}
                    ${appendCheckBox(
                        AUTOMOVEMYSTERIESBETAFOUND,
                        lang.type_found,
                        updateMoveMysteries,
                        true,
                        state_found
                    )}
                    ${appendCheckBox(
                        AUTOMOVEMYSTERIESBETAUNSOLVED,
                        lang.type_unsolved,
                        updateMoveMysteries,
                        false,
                        state_unsolved
                    )}
                </div>
                ${appendCheckBox(
                    AUTOMOVEMYSTERIESBETAHOME,
                    lang.map_home,
                    updateMoveMysteries
                )}
                ${appendCheckBox(
                    AUTOMOVEMYSTERIESBETAAREA,
                    lang.map_area,
                    updateMoveMysteries
                )}
                ${appendCheckBox(
                    AUTOMOVEMYSTERIESBETAINCLUDEWPT,
                    lang.map_includewpt,
                    updateMoveMysteries
                )}
            </div>
        `
    );

    setTimeout(() => {
        $("#mmSub").slideToggle();
        updateMoveMysteries();
    }, 500);
};

export const addGccMenuHide = () => {
    NewSlideMenu("", {
        iconImg: gccIcon,
        position: "topright",
        menuposition: "topright",
        marginvertical: "65"
    }).addTo(map);
    render(
        $(".leaflet-menu-contents")[0],
        html`
            <b>
                ${appendCheckBox(
                    AUTOMOVEMYSTERIESBETA,
                    lang.map_enablemm,
                    () => {
                        $("#mmSub").slideToggle();
                        _updateMapViewHide();
                    }
                )}
            </b>
            <div id="mmSub" style="display:none; padding: 0 15px;">
                ${appendCheckBox(
                    AUTOMOVEMYSTERIESBETAINCLUDEWPT,
                    lang.map_includewpt,
                    _updateMapViewHide
                )}
            </div>
        `
    );
    setTimeout(() => {
        $("#mmSub").slideToggle();
        _updateMapViewHide();
    }, 500);
};

const _updateMapViewHide = () => {
    deleteAllGccMarkers();
    if (!$(`#${AUTOMOVEMYSTERIESBETA}`).prop("checked")) {
        return;
    }
    const includeWaypoints = GM_getValue(AUTOMOVEMYSTERIESBETAINCLUDEWPT);
    var keys = GM_listValues();
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.indexOf(COMPREFIX) > -1) {
            var guid = key.substring(COMPREFIX.length, key.length);
            var comment = doLoadCommentFromGUID(guid);

            if (comment.lat && comment.lng) {
                drawCircleWithData(
                    comment.lat,
                    comment.lng,
                    "161",
                    `<a href="https://coord.info/${comment.gccode}" target="_blank">${comment.name}<br>(${comment.gccode})</a>`,
                    "#0000FF"
                );
            }

            if (
                includeWaypoints &&
                comment.waypoints &&
                comment.waypoints.length > 0
            ) {
                for (var j = 0; j < comment.waypoints.length; j++) {
                    var coords = parseCoordinates(
                        comment.waypoints[j].coordinate
                    );
                    var wpName = comment.waypoints[j].name;
                    if (wpName === null || wpName === "") {
                        wpName = "unnamed_wp";
                    }

                    if (coords.length == 2) {
                        drawCircleWithData(
                            coords[0],
                            coords[1],
                            "161",
                            `<a href="https://coord.info/${comment.gccode}" target="_blank">WP: ${wpName}\n${comment.name}<br>(${comment.gccode})</a>`,
                            "#00FF00"
                        );
                    }
                }
            }
        }
    }
};

const createGccLayerIfRequired = () => {
    if (gccLayer === null) {
        gccLayer = new leaflet.LayerGroup();
        gccLayer.addTo(map);
    }
};

export const drawMarker = (
    /** @type {CacheComment}**/ comment,
    /** @type {number} */ lat,
    /** @type {number} */ lng,
    /** @type {string} */ type,
    /** @type {string} */ state,
    /** @type {string} */ gccode
) => {
    createGccLayerIfRequired();
    var iconSize = new leaflet.Point(22, 22);
    var iconAnchor = new leaflet.Point(11, 11);
    var url = null;

    if (type === "final" && state === "found") url = finaliconfound;
    else if (type === "final" && state === "solved") url = finaliconsolved;
    else if (type === "final" && state === "not solved")
        url = finaliconunsolved;
    else if (type === "originCoord" && state === "found") url = origfound;
    else if (type === "originCoord" && state === "solved") url = origsolved;
    else if (type === "originCoord" && state === "not solved")
        url = origunsolved;
    else if (type === "wpt") {
        url = waypointIcon;
        iconSize = new leaflet.Point(16, 16);
        iconAnchor = new leaflet.Point(8, 8);
    } else {
        log("info", `unkonw type: ${type}`);
        return;
    }

    // http://www.geocaching.com/map/map.details?i=GC2KHDH&_=1330805175632
    var finalMarker = new leaflet.Icon({
        iconUrl: url,
        iconSize: iconSize,
        iconAnchor: iconAnchor
    });
    var marker = new leaflet.Marker(new leaflet.LatLng(lat, lng), {
        icon: finalMarker
    });

    if (makerClickCallback) {
        marker.on("click", () => {
            makerClickCallback(comment, gccode, marker, map, leaflet);
        });
    }

    gccLayer.addLayer(marker);
};

export const drawLine = (finallat, finallng, origlat, origlng, state) => {
    var latlngs = new Array();
    latlngs.push(new leaflet.LatLng(finallat, finallng));
    latlngs.push(new leaflet.LatLng(origlat, origlng));
    var color = "red";
    if (state === "found") color = "#cccccc";
    else if (state === "solved") color = "#66ff00";
    else if (state === "not solved") color = "#ff0000";

    var link = new leaflet.Polyline(latlngs, {
        color: color,
        weight: 2,
        interactive: false,
        opacity: 1,
        fillOpacity: 1
    });

    gccLayer.addLayer(link);
};

export const drawMultiline = (aWaypoints, state) => {
    var color = "red";
    if (state === "found") color = "#cccccc";
    else if (state === "solved") color = "#66ff00";
    else if (state === "not solved") color = "#ff0000";

    aWaypoints = aWaypoints.map((p) => new leaflet.LatLng(p[0], p[1]));

    var link = new leaflet.Polyline(aWaypoints, {
        color: color,
        weight: 2,
        interactive: false,
        opacity: 1,
        fillOpacity: 1
    });

    gccLayer.addLayer(link);
};

export const drawCircle = (finallat, finallng, radius, color = "#000000") => {
    var latlng = new leaflet.LatLng(finallat, finallng);

    var circle = new leaflet.Circle(latlng, radius, {
        color: color,
        weight: 2,
        fill: true,
        interactive: false,
        opacity: 1,
        fillOpacity: 0.2
    });

    gccLayer.addLayer(circle);
};

export const drawCircleWithData = (
    finallat,
    finallng,
    radius,
    popupContent = "",
    color = "#000000"
) => {
    const geoJson = {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [finallng, finallat]
        },
        properties: {
            popupContent: popupContent
        }
    };

    // @ts-ignore
    const circle = leaflet.geoJson(geoJson, {
        pointToLayer: (feature, latlng) => {
            return new leaflet.Circle(latlng, radius, {
                color: color,
                weight: 2,
                fill: true,
                interactive: false,
                opacity: 1,
                fillOpacity: 0.2
            });
        },
        onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.popupContent) {
                layer.bindPopup(feature.properties.popupContent);
            }
        }
    });

    gccLayer.addLayer(circle);
};

export const createMovedFinal = (comment, drawOriginCoord, drawArea) => {
    log(
        "debug",
        "drawing " +
            comment.guid +
            " lat: " +
            comment.lat +
            " lng: " +
            comment.lng +
            " origlat: " +
            parseFloat(comment.origlat) +
            " origlng: " +
            parseFloat(comment.origlng)
    );

    drawMarker(
        comment,
        comment.lat,
        comment.lng,
        "final",
        comment.state,
        comment.gccode
    );

    if (drawArea) {
        drawCircle(comment.lat, comment.lng, "161");
    }

    if (
        drawOriginCoord &&
        parseFloat(comment.origlat) &&
        parseFloat(comment.origlng)
    ) {
        drawLine(
            comment.lat,
            comment.lng,
            parseFloat(comment.origlat),
            parseFloat(comment.origlng),
            comment.state
        );
        drawMarker(
            comment,
            parseFloat(comment.origlat),
            parseFloat(comment.origlng),
            "originCoord",
            comment.state,
            comment.gccode
        );
    }
};
export const drawSingleCache = (
    /** @type {import("../../../dataClasses/cacheComment.js").CacheComment} */ comment,
    detailPageMode = false
) => {
    if (!comment) {
        return;
    }

    const found = detailPageMode || GM_getValue(AUTOMOVEMYSTERIESBETAFOUND);
    const solved = detailPageMode || GM_getValue(AUTOMOVEMYSTERIESBETASOLVED);
    const unsolved =
        detailPageMode || GM_getValue(AUTOMOVEMYSTERIESBETAUNSOLVED);
    const drawOrigPos =
        !detailPageMode && GM_getValue(AUTOMOVEMYSTERIESBETAHOME);
    const includeWaypoints =
        detailPageMode || GM_getValue(AUTOMOVEMYSTERIESBETAINCLUDEWPT);
    const drawArea = !detailPageMode && GM_getValue(AUTOMOVEMYSTERIESBETAAREA);

    var stUnsolved = null;
    if (unsolved) {
        stUnsolved = StateEnum.unsolved;
    }

    var stSolved = null;
    if (solved) {
        stSolved = StateEnum.solved;
    }

    var stFound = null;
    if (found) {
        stFound = StateEnum.found;
    }

    if (
        detailPageMode ||
        ((comment.state == stSolved ||
            comment.state == stFound ||
            comment.state == stUnsolved) &&
            !comment.archived)
    ) {
        if (comment.lat && comment.lng) {
            createMovedFinal(comment, drawOrigPos, drawArea);
        }

        if (
            includeWaypoints &&
            comment.waypoints &&
            comment.waypoints.length > 0
        ) {
            var aWaypoints = [];
            aWaypoints.push([comment.origlat, comment.origlng]);

            for (var j = 0; j < comment.waypoints.length; j++) {
                var coords = parseCoordinates(comment.waypoints[j].coordinate);
                if (coords.length == 2) {
                    aWaypoints.push([coords[0], coords[1]]);
                    drawMarker(
                        comment,
                        coords[0],
                        coords[1],
                        "wpt",
                        null,
                        comment.gccode
                    );
                    if (drawArea) {
                        drawCircle(coords[0], coords[1], "161");
                    }
                }
            }
            // add final wpt to link the last wpt to it
            if (comment.lat && comment.lng) {
                aWaypoints.push([comment.lat, comment.lng]);
            }

            drawMultiline(aWaypoints, comment.state);
        }
    }
};
