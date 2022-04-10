import $ from "jquery";
import { lang } from "../../consts/language/language";
import { AUTO_UPLOAD_CACHE_NOTES } from "../../consts/preferences.js";
import { convertDec2DMS, parseCoordinates } from "../../helper/coordinates.js";
import { GMWindow } from "../../helper/gmWindow";
import { log } from "../../helper/logger.js";
import { CacheComment } from "./../../dataClasses/cacheComment";

export const retrieveOriginalCoordinates = () => {
    var origCoordinates;
    // try to get it from GS
    if (
        // @ts-ignore
        window.userDefinedCoords &&
        // @ts-ignore
        window.userDefinedCoords.data &&
        // @ts-ignore
        window.userDefinedCoords.data.oldLatLngDisplay
    ) {
        origCoordinates = parseCoordinates(
            // @ts-ignore
            window.userDefinedCoords.data.oldLatLngDisplay
        );
    } else {
        // grab it from page
        origCoordinates = parseCoordinates(
            document.getElementById("uxLatLon").innerHTML
        );
    }

    if (origCoordinates.length == 2) {
        return origCoordinates;
    } else {
        log("error", "Original Coordinates of cache could not be determined.");
        return ["", ""];
    }
};

export const resetUserCoordinate = () => {
    log("debug", "resetUserCoordinate");
    $.post({
        url: "/seek/cache_details.aspx/ResetUserCoordinate",
        data: JSON.stringify({
            dto: {
                // @ts-ignore
                ut: GMWindow.userToken
            }
        }),
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: (response) => {
            var r = JSON.parse(response.d);
            if (r.status == "success") {
                log("debug", "resetUserCoordinate done");
                // TODO: make a setting for coordinate manipulation reload
                if (false) {
                    // TODO: check uxLatLon patching result
                    const originalCoords = retrieveOriginalCoordinates();
                    $("#uxLatLon").text(
                        convertDec2DMS(originalCoords[0], originalCoords[1])
                    );
                } else {
                    window.location.reload();
                }
            }
        }
    });
};

export const setUserCoordinate = (lat, lng) => {
    const originalCoords = retrieveOriginalCoordinates();
    if (originalCoords[0] == lat && originalCoords[1] == lng) {
        log("debug", "setUserCoordinate not required");
        return;
    }

    log("debug", "setUserCoordinate");

    $.post({
        url: "/seek/cache_details.aspx/SetUserCoordinate",
        data: JSON.stringify({
            dto: {
                data: {
                    lat: lat,
                    lng: lng
                },
                // @ts-ignore
                ut: GMWindow.userToken
            }
        }),
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: (response) => {
            var r = JSON.parse(response.d);
            if (r.status == "success") {
                log("debug", "setUserCoordinate done");
                // TODO: make a setting for coordinate manipulation reload
                // reload or patch (not everything is up to date then)
                if (false) {
                    // TODO: check uxLatLon patching result
                    $("#uxLatLon").text(convertDec2DMS(lat, lng));
                } else {
                    window.location.reload();
                }
            }
        }
    });
};

export const saveToCacheNote = (/** @type {CacheComment} */ comment) => {
    if (!GM_getValue(AUTO_UPLOAD_CACHE_NOTES)) {
        return;
    }

    /** @returns {String} */
    function getCacheNoteText(/** @type {CacheComment} */ comment) {
        var result = "GCCNote:\n";

        if (comment.lat !== undefined && comment.lng !== undefined) {
            result += `${lang.final_coordinate}:${convertDec2DMS(
                comment.lat,
                comment.lng
            )}\n`;
        }

        comment.waypoints.forEach((wp) => {
            result += `${wp.name}:${wp.coordinate}\n`;
        });

        result += "\n" + comment.commentValue;

        return result;
    }

    if (comment) {
        const originalNote = $("#viewCacheNote").text();
        if (
            originalNote.indexOf("GCCNote:") === -1 &&
            (originalNote.indexOf("Click to enter a note") === -1 ||
                originalNote === "")
        ) {
            log(
                "info",
                "saveToCacheNote failed: cache note contains other text"
            );
            return;
        }

        var newNote = getCacheNoteText(comment).trim();
        if (newNote.length > 500) {
            newNote = newNote.substr(0, 500);
        }

        if (originalNote === newNote) {
            log(
                "debug",
                "saveToCacheNote: cache note identical - nothing to do"
            );
            return;
        }

        $("#cacheNoteText").val(newNote);
        $(".js-pcn-submit").trigger("click");
    }
};
