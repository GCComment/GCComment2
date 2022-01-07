
import {COMGCPREFIX, COMPREFIX, DELIM} from "../consts/general.js";
import {log} from "../helper/logger.js";
import {getGUIDFromGCCode} from "../helper/gccode.js";
import {GCC_setValue} from "../helper/storage.js"
import {GCC_getValue} from "../helper/storage.js"

export const doSaveCommentWTimeToGUID = function (guid, gccode, name, commentValue, saveTime, state, lat, lng, origlat,
    origlng, archived) {
    var key = "";
    var value = "";
    var actualGUID = "";
    var actualGCCode = "";

    if (typeof guid === "object") { // we got a JSON object (hopefully)
        key = COMPREFIX + guid.guid;
        value = JSON.stringify(guid);
        actualGUID = guid.guid;
        actualGCCode = guid.gccode;
    } else {
        key = COMPREFIX + guid;
        value = gccode + DELIM + name + DELIM + commentValue + DELIM + saveTime + DELIM + state + DELIM + lat
            + DELIM + lng + DELIM + origlat + DELIM + origlng + DELIM + archived;
        actualGUID = guid;
        actualGCCode = gccode;
    }

    if (key && value && actualGUID && actualGCCode) {
        GCC_setValue(key, value);
        log("info", "saving " + key + " - " + value);

        // index entry for fast gccode-guid determination
        var keyIndex = COMGCPREFIX + actualGCCode;
        GCC_setValue(keyIndex, actualGUID);
    } else {
        log('debug', 'Error saving ' + guid + ". key=" + key + " value=" + value + " actualGUID=" + actualGUID
            + " actualGCCode=" + actualGCCode);
    }
}

export const doSaveCommentToGUID = function (guid, gccode, name, commentValue, state, lat, lng, origlat, origlng, archived) {
    var now = new Date();
    if (typeof guid === "object") { // we got a JSON Object (hopefully)
        guid.saveTime = (now - 0);
        doSaveCommentWTimeToGUID(guid);
    } else {
        doSaveCommentWTimeToGUID(guid, gccode, name, commentValue, (now - 0), state, lat, lng, origlat, origlng,
            archived);
    }
}

export const doLoadCommentFromGUID = function (guid) {
    var c = GCC_getValue(COMPREFIX + guid);
    // log("info", "loaded: " + c);

    var comment;

    if (!c) {
        // log('debug', 'tried to load ' + guid);
        return null;
    }

    if (c.charAt(0) === "{") { // we stored a JSON object
        comment = JSON.parse(c);
        // log('debug', 'loaded json ' + guid);
    } else {
        // log('debug', 'loaded gcc ' + guid);
        comment = {};
        var details = c.split(DELIM);
        comment.guid = guid;
        comment.gccode = details[0];
        comment.name = details[1];
        comment.commentValue = details[2];
        comment.saveTime = details[3];
        comment.state = details[4];
        if ((details[5] != "undefined") && (details[5] != "null") && (details[5] != ""))
            comment.lat = details[5];
        if ((details[6] != "undefined") && (details[6] != "null") && (details[6] != ""))
            comment.lng = details[6];
        if ((details[7] != "undefined") && (details[7] != "null") && (details[7] != ""))
            comment.origlat = details[7];
        if ((details[8] != "undefined") && (details[8] != "null") && (details[8] != ""))
            comment.origlng = details[8];
        if ((details[9] != "undefined") && (details[9] != "null") && (details[9] != ""))
            comment.archived = details[9];
    }
    return comment;
}

export const doLoadCommentFromGCCode = function (gcCode) {
    var guid = getGUIDFromGCCode(gcCode);
    return doLoadCommentFromGUID(guid);
}

export const getNumberOfComments = function() {
    var keys = GM_listValues();
    var counter = 0;
    for (var ind = 0; ind < keys.length; ind++) {
        var commentKey = keys[ind];
        if (commentKey.indexOf(COMPREFIX) > -1)
            counter++;
    }
    return counter;
}