import $ from "jquery";
import { CacheComment } from "../../dataClasses/cacheComment.js";
import { GMWindow } from "../../helper/gmWindow.js";
import { waitForPropOfObject } from "../../helper/wait.js";
import {
    drawSingleCache,
    setLayer,
    setMap
} from "../mapPage/mapHelper/mapDraw.js";

/**
 * @type L.Map
 */
var map;
/**
 * @type L.FeatureGroup
 */
var layerGroupOriginal;
/**
 * @type L.FeatureGroup
 */
var layerGroupGcc;
/**
 * @type L.FeatureGroup
 */
var layerGroupAll;

export const patchSmallMap = (/** @type {CacheComment} */ comment) => {
    waitForPropOfObject("L.map", GMWindow, () => patchSmallMapInteral(comment));
};

const patchSmallMapInteral = (/** @type {CacheComment} */ comment) => {
    // Destroy original map (hooks getting the original map are not reliable)
    $("#map_canvas")
        .after(
            '<div id="map_canvas_gcc" style="width: 325px; height: 325px; position: relative;" class="leaflet-container leaflet-fade-anim" tabindex="0"></div>'
        )
        .hide();
    // Recreate original map, but get us a accass so that we can manipulate
    recreateSmallMap();
    // link the map instace with our map lib
    setMap(map);
    // set our own layer
    setLayer(layerGroupGcc);
    // draw comment
    drawSingleCache(comment, true);
    // Adjust zoom to show all markers
    map.fitBounds(layerGroupAll.getBounds(), {});
    map.setZoom(Math.floor(map.getZoom()));
};

const recreateSmallMap = () => {
    /**
     * @type L
     */
    const leaflet = GMWindow.L;
    /**
     * @type object[]
     */
    const additionalWPs = GMWindow.cmapAdditionalWaypoints;
    const cacheInfo = GMWindow.mapLatLng;

    map = leaflet.map("map_canvas_gcc", {
        center: [cacheInfo.lat, cacheInfo.lng],
        zoom: 14,
        doubleClickZoom: true,
        dragging: true,
        touchZoom: false,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: true
    });

    leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
        .addTo(map);

    layerGroupOriginal = new leaflet.FeatureGroup();
    layerGroupGcc = new leaflet.FeatureGroup();
    layerGroupAll = new leaflet.FeatureGroup();

    layerGroupOriginal.addTo(layerGroupAll);
    layerGroupGcc.addTo(layerGroupAll);
    layerGroupAll.addTo(map);

    additionalWPs.forEach((wp) => {
        leaflet
            .marker([wp.lat, wp.lng], {
                icon: leaflet.icon({
                    iconUrl: "/images/wpttypes/pins/" + wp.type + ".png",
                    iconSize: [20, 23],
                    iconAnchor: [10, 23]
                }),
                title: wp.name,
                interactive: false
            })
            .addTo(layerGroupOriginal);
    });

    leaflet
        .marker([cacheInfo.lat, cacheInfo.lng], {
            icon: leaflet.icon({
                iconUrl: "/images/wpttypes/pins/" + cacheInfo.type + ".png",
                iconSize: [20, 23],
                iconAnchor: [10, 23]
            }),
            interactive: false,
            title: cacheInfo.name
        })
        .addTo(layerGroupOriginal);

    return [map, layerGroupAll, layerGroupGcc];
};
