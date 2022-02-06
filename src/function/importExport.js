import { LAST_IMPORT } from "../consts/general.js";
import { log } from "../helper/logger.js";
import { GCC_setValue } from "../helper/storage.js";
import { unescapeXML } from "../helper/xml.js";
import { doLoadCommentFromGUID, doSaveCommentWTimeToGUID } from "./db.js";

export const parseImport = (importText) => {
    try {
        var aJSON = JSON.parse(importText);
        var aExisted = [];
        var aOverwrite = [];
        var aNew = [];
        aJSON.forEach((element, index) => {
            var oExisting = doLoadCommentFromGUID(element.guid);
            if (oExisting) {
                if (
                    oExisting.saveTime != null &&
                    oExisting.saveTime >= element.saveTime
                ) {
                    aExisted.push(element);
                } else {
                    aOverwrite.push(element);
                }
            } else {
                aNew.push(element);
            }
        });
    } catch (ex) {
        log("ex: " + ex);
        parseXMLImport(importText);
    }
};

function parseXMLImport(importText) {
    // log("debug", "parsing..." + importText.value);
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(importText, "text/xml");
    xmlDoc.normalize();
    var comments = xmlDoc.getElementsByTagName("comment");
    var resultImported = "";
    var resultNotImported = "  ";
    var importedCount = 0;
    var notImportedCount = 0;
    for (var i = 0; i < comments.length; i++) {
        var imID = comments[i].childNodes[0].childNodes[0].nodeValue;
        var imCode = "";
        if (comments[i].childNodes[1].childNodes[0])
            imCode = comments[i].childNodes[1].childNodes[0].nodeValue;
        var imName = unescapeXML(
            unescape(comments[i].childNodes[2].childNodes[0].nodeValue)
        );
        var imContent = "";
        if (comments[i].childNodes[3].childNodes[0]) {
            imContent = unescapeXML(
                unescape(comments[i].childNodes[3].childNodes[0].nodeValue)
            );
        }
        if (imContent == "null" || imContent == "undefined") imContent = "";

        var imSave = comments[i].childNodes[4].childNodes[0].nodeValue;

        var imState; // new property "state" with version 40
        if (comments[i].childNodes[5])
            imState = comments[i].childNodes[5].childNodes[0].nodeValue;

        var imLat = "",
            imLng = ""; // new props lat, lng since v46
        if (comments[i].childNodes[6] && comments[i].childNodes[7]) {
            if (comments[i].childNodes[6].childNodes[0])
                imLat = comments[i].childNodes[6].childNodes[0].nodeValue;
            if (comments[i].childNodes[7].childNodes[0])
                imLng = comments[i].childNodes[7].childNodes[0].nodeValue;
        }

        var imOriglat = "",
            imOriglng = ""; // new props for orig coordinate of
        // cache
        if (comments[i].childNodes[8] && comments[i].childNodes[9]) {
            if (comments[i].childNodes[8].childNodes[0])
                imOriglat = comments[i].childNodes[8].childNodes[0].nodeValue;
            if (comments[i].childNodes[9].childNodes[0])
                imOriglng = comments[i].childNodes[9].childNodes[0].nodeValue;
        }

        var imArchived = "";
        if (comments[i].childNodes[10]) {
            if (comments[i].childNodes[10].childNodes[0])
                imArchived = comments[i].childNodes[10].childNodes[0].nodeValue;
        }

        var imWaypoints = [];
        if (comments[i].childNodes[11]) {
            for (
                var j = 0;
                j < comments[i].childNodes[11].childNodes.length;
                j++
            ) {
                var Xwpt = comments[i].childNodes[11].childNodes[j];
                // log('debug', 'Xwpt: ' + Xwpt.nodeName);
                // log('debug', 'Xwpt: ' + Xwpt.childNodes);
                // log('debug', 'Xwpt: ' + Xwpt.childNodes[0].nodeName);
                // log('debug', 'Xwpt: ' + Xwpt.childNodes[0].nodeValue);
                // log('debug', 'Xwpt: ' + Xwpt.childNodes[0].childNodes[0].nodeName);
                // log('debug', 'Xwpt: ' + Xwpt.childNodes[0].childNodes[0].nodeValue);
                imWaypoints.push({
                    prefix: Xwpt.childNodes[0].childNodes[0].nodeValue,
                    lookup: Xwpt.childNodes[1].childNodes[0].nodeValue,
                    name: Xwpt.childNodes[2].childNodes[0].nodeValue,
                    coordinate: unescapeXML(
                        unescape(Xwpt.childNodes[3].childNodes[0].nodeValue)
                    )
                });
            }
        }
        // log('debug', "importing: " + imID + ":" + imCode + ":" + imName + ":"
        // + imContent + ":" + imSave + ":" + imState + ":" + imLat + ":"
        // + imLng + ":" + imOriglat + ":" + imOriglng + ":" + imArchived + ":" +
        // imWaypoints);

        var existing = doLoadCommentFromGUID(imID);
        if (existing != null) {
            if (existing.saveTime != null && existing.saveTime >= imSave) {
                // newer or equal old comment exists, do not import
                resultNotImported =
                    resultNotImported +
                    "<a target='blank' href='http://www.geocaching.com/seek/cache_details.aspx?guid=" +
                    imID +
                    "'>" +
                    imName +
                    " (" +
                    imCode +
                    ")</a>, ";
                notImportedCount++;
            } else {
                var comment = {
                    guid: imID,
                    gccode: imCode,
                    name: imName,
                    commentValue: imContent,
                    saveTime: imSave,
                    state: imState,
                    lat: imLat,
                    lng: imLng,
                    origlat: imOriglat,
                    origlng: imOriglng,
                    archived: imArchived,
                    waypoints: imWaypoints
                };
                // comment is more recent than existing one, import and replace
                // existing!
                importedCount++;
                doSaveCommentWTimeToGUID(comment);
            }
        } else {
            // no comment yet, so import it
            var comment = {
                guid: imID,
                gccode: imCode,
                name: imName,
                commentValue: imContent,
                saveTime: imSave,
                state: imState,
                lat: imLat,
                lng: imLng,
                origlat: imOriglat,
                origlng: imOriglng,
                archived: imArchived,
                waypoints: imWaypoints
            };
            doSaveCommentWTimeToGUID(comment);
            importedCount++;
        }
    }

    GCC_setValue(LAST_IMPORT, "" + (new Date() - 0));
}
