import { log } from "./logger.js";
import { lang } from "../consts/language.js";
import { toRad } from "../helper/math.js";

export const convertDec2DMS = (
    /** @type {Number} */ lt,
    /** @type {Number} */ lg
) => {
    var lat = lt;
    var lng = lg;
    var result = "";
    if (lat < 0) {
        result = result + "S ";
        lat = lat * -1;
    } else result = result + "N ";

    if (lat < 10 && lat > -10) result = result + "0";
    result = result + parseInt(lat) + String.fromCharCode(176) + " ";
    lat = lat - parseInt(lat);
    var latFormatted = (Math.round(parseFloat(lat * 60) * 1000) / 1000).toFixed(
        3
    );
    if (latFormatted < 10 && latFormatted > -10) result = result + "0";
    result = result + latFormatted + " ";

    if (lng < 0) {
        result = result + " W ";
        lng = lng * -1;
    } else result = result + " E ";

    if (lng < 10 && lng > -10) result = result + "00";
    else if (lng < 100 && lng > -100) result = result + "0";

    result = result + parseInt(lng) + String.fromCharCode(176) + " ";
    lng = lng - parseInt(lng);
    var lngFormatted = (Math.round(parseFloat(lng * 60) * 1000) / 1000).toFixed(
        3
    );
    if (lngFormatted < 10 && lngFormatted > -10) result = result + "0";
    result = result + lngFormatted;

    return result;
};

export const parseCoordinates = (cstr) => {
    var regexDegMin =
        /([NS])\s*(\d+)\D\s*(\d+\.\d+)'*\s*([EW])\s*(\d+)\D\s*(\d+\.\d+)'*/i;

    var fin = [];
    var items = regexDegMin.exec(cstr);
    if (items != null && items.length == 7) {
        log("info", `parsing successful DegMin: ${items}`);
        var lat1 = RegExp.$2;
        while (lat1.indexOf(0) == 0) {
            lat1 = lat1.substring(1, lat1.length);
        }
        if (lat1.length == 0) lat1 = 0;

        var lat2 = RegExp.$3;
        var lat = parseInt(lat1) + parseFloat(lat2) / 60;
        if (RegExp.$1 == "S") lat = lat * -1;

        var lng1 = RegExp.$5;
        while (lng1.indexOf(0) == 0) {
            lng1 = lng1.substring(1, lng1.length);
        }
        if (lng1.length == 0) lng1 = 0;
        var lng2 = RegExp.$6;
        var lng = parseInt(lng1) + parseFloat(lng2) / 60;
        if (RegExp.$4 == "W") lng = lng * -1;

        fin.push(lat);
        fin.push(lng);
        return fin;
    }

    var regexPlain = /(\d+)\s+(\d+\.\d+)\s+(\d+)\s+(\d+\.\d+)/i;
    items = regexPlain.exec(cstr);
    if (items != null && items.length == 5) {
        log("info", `parsing successful Plain: ${items}`);
        var lat1 = RegExp.$1;
        while (lat1.indexOf(0) == 0) {
            lat1 = lat1.substring(1, lat1.length);
        }
        if (lat1.length == 0) lat1 = 0;

        var lat2 = RegExp.$2;
        var lat = parseInt(lat1) + parseFloat(lat2) / 60;

        var lng1 = RegExp.$3;
        while (lng1.indexOf(0) == 0) {
            lng1 = lng1.substring(1, lng1.length);
        }
        if (lng1.length == 0) lng1 = 0;
        var lng2 = RegExp.$4;
        var lng = parseInt(lng1) + parseFloat(lng2) / 60;
        fin.push(lat);
        fin.push(lng);
        return fin;
    }

    var regexDec = /(\d+\.\d+)(,\s*|\s+)(\d+\.\d+)/i;
    items = regexDec.exec(cstr);
    if (items != null && items.length == 4) {
        log("info", `parsing successful Dec: ${items}`);
        var lat1 = RegExp.$1;
        while (lat1.indexOf(0) == 0) {
            lat1 = lat1.substring(1, lat1.length);
        }
        if (lat1.length == 0) lat1 = 0;

        var lat = parseFloat(lat1);

        var lng1 = RegExp.$3;
        while (lng1.indexOf(0) == 0) {
            lng1 = lng1.substring(1, lng1.length);
        }
        if (lng1.length == 0) lng1 = 0;
        var lng = parseFloat(lng1);
        fin.push(lat);
        fin.push(lng);
        return fin;
    }

    fin.push(lang.alert_coordsnotvalid);
    return fin;
};

export const calculateDistance = (lat_1, lon_1, lat_2, lon_2) => {
    var R = 6371; // km
    var lat1dec = parseFloat(lat_1);
    var lon1dec = parseFloat(lon_1);
    var lat2dec = parseFloat(lat_2);
    var lon2dec = parseFloat(lon_2);
    var dLat = toRad(lat2dec - lat1dec);
    var dLon = toRad(lon2dec - lon1dec);
    var lat1 = toRad(lat1dec);
    var lat2 = toRad(lat2dec);

    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1) *
            Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};
