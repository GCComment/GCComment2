import $ from 'jquery';
import { finaliconfound, finaliconsolved, finaliconunsolved, origfound, origsolved, origunsolved, waypointIcon } from '../../../consts/icons.js';
import { AUTOMOVEMYSTERIESBETAAREA } from '../../../consts/preferences.js';
import { GMWindow } from '../../../helper/gmWindow.js';
import { log } from '../../../helper/logger.js';

/** @type {L.Map} */ 
var map = null;
/** @type {L} */ 
var leaflet = null;

var gccLayer = null;

export const setMap = (m) => {
    map = m;
    // @ts-ignore
    leaflet = GMWindow.L;
};

export const deleteAllGccMarkers = () => {
    if(gccLayer !== null){
        map.removeLayer(gccLayer);
        gccLayer = null;
    }    
};

const createGccLayerIfRequired = () => {
    if(gccLayer === null){        
        gccLayer = new leaflet.LayerGroup();
        gccLayer.addTo(map);
    }    
}

export const drawMarker = (/** @type {number} */ lat, /** @type {number} */ lng, /** @type {string} */ type, /** @type {string} */ state, /** @type {string} */ gccode) => {
    createGccLayerIfRequired();
    var iconSize = new leaflet.Point(22, 22);
    var iconAnchor = new leaflet.Point(11, 11);
    var url = null;

    if (type === "final" && state === "found")
        url = finaliconfound;
    else if (type === "final" && state === "solved")
        url = finaliconsolved;
    else if (type === "final" && state === "not solved")
        url = finaliconunsolved;
    else if (type === "originCoord" && state === "found")
        url = origfound;
    else if (type === "originCoord" && state === "solved")
        url = origsolved;
    else if (type === "originCoord" && state === "not solved")
        url = origunsolved;
    else if (type === "wpt") {
        url = waypointIcon;
        iconSize = new leaflet.Point(16, 16);
        iconAnchor = new leaflet.Point(8, 8);
    }
    else{
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
    marker.on('click', function (event) {
        /*
        var gcurl = "https://tiles01.geocaching.com/map/map.details?i=" + gccode + "&jsoncallback=?";
        var success = function (a) {            
            var b = "cd" + Math.ceil(9999999999999 * Math.random());
            var h = `<div id="${b}"></div>`;           

            var popup = new leaflet.Popup({
                offset: new leaflet.Point(-178, 2)
            });
            popup.setContent(h);
            popup.setLatLng(marker.getLatLng());
            map.openPopup(popup);

            $('#map_canvas').find("#" + b).link(a, "#cachePopupTemplate")
                .delegate("a.prev-item", "click", function (a) {
                        a.preventDefault();
                        $(this).parents("div.map-item").hide().prev().show();
                        return false;
                }).delegate("a.next-item", "click", function (a) {
                    a.preventDefault();
                    $(this).parents("div.map-item").hide().next().show();
                    return false;
                });
            $('#map_canvas').find("#" + b).parent().width('401px');
            setTimeout(function () {
                popup._adjustPan();
            }, 100);
        };
        $.getJSON(gcurl, success);
        */
    }); 

    gccLayer.addLayer(marker);
};

export const  drawLine = (finallat, finallng, origlat, origlng, state) => {
    var latlngs = new Array();
    latlngs.push(new leaflet.LatLng(finallat, finallng));
    latlngs.push(new leaflet.LatLng(origlat, origlng));
    var color = "red";
    if (state === "found")
        color = "#cccccc";
    else if (state === "solved")
        color = "#66ff00";
    else if (state === "not solved")
        color = "#ff0000";

    var link = new leaflet.Polyline(latlngs, {
        color : color,
        weight : 2,
        interactive : false,
        opacity : 1,
        fillOpacity : 1
    });

    gccLayer.addLayer(link);
};

export const drawMultiline = (aWaypoints, state) => {
    var color = "red";
    if (state === "found")
        color = "#cccccc";
    else if (state === "solved")
        color = "#66ff00";
    else if (state === "not solved")
        color = "#ff0000";

    aWaypoints = aWaypoints.map((p) => new leaflet.LatLng(p[0], p[1]));

    var link = new leaflet.Polyline(aWaypoints, {
        color : color,
        weight : 2,
        interactive : false,
        opacity : 1,
        fillOpacity : 1
    });

    gccLayer.addLayer(link);
};

export const drawCircle = (finallat, finallng, radius) => {
    var latlng = new leaflet.LatLng(finallat, finallng);
    var color = "#000000";

    var circle = new leaflet.Circle(latlng, radius, {
        color : color,
        weight : 2,
        fill : true,
        interactive : false,
        opacity : 1,
        fillOpacity : 0.2
    });

    gccLayer.addLayer(circle);
};

export const createMovedFinal = (comment, drawOriginCoord) => {
    log('debug', 'drawing ' + comment.guid + " lat: " + comment.lat + " lng: " +
        comment.lng + " origlat: " + parseFloat(comment.origlat) + " origlng: " + parseFloat(comment.origlng));

    drawMarker(comment.lat, comment.lng, "final", comment.state, comment.gccode);

    if (GM_getValue(AUTOMOVEMYSTERIESBETAAREA)) {
        drawCircle(comment.lat, comment.lng, "161");
    }

    if (drawOriginCoord && parseFloat(comment.origlat) && parseFloat(comment.origlng)) {
        drawLine(comment.lat, comment.lng, parseFloat(comment.origlat), parseFloat(comment.origlng), comment.state);
        drawMarker(parseFloat(comment.origlat), parseFloat(comment.origlng), "originCoord", comment.state, comment.gccode);
    }
};