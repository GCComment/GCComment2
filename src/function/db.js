import { COMGCPREFIX, COMPREFIX, DELIM } from "../consts/general.js";
import { log } from "../helper/logger.js";
import { getGUIDFromGCCode } from "../helper/gccode.js";
import { GCC_getValue, GCC_setValue } from "../helper/storage.js";
import { CacheComment } from "../dataClasses/cacheComment.js";

export const doSaveCommentWTimeToGUID = (
    /** @type {CacheComment} */ comment
) => {
    var key = "";
    var value = "";
    var actualGUID = "";
    var actualGCCode = "";

    key = COMPREFIX + comment.guid;
    value = JSON.stringify(comment);
    actualGUID = comment.guid;
    actualGCCode = comment.gccode;

    if (key && value && actualGUID && actualGCCode) {
        GCC_setValue(key, value);
        log("info", "saving " + key + " - " + value);

        // index entry for fast gccode-guid determination
        var keyIndex = COMGCPREFIX + actualGCCode;
        GCC_setValue(keyIndex, actualGUID);
    } else {
        log(
            "debug",
            "Error saving " +
                comment.guid +
                ". key=" +
                key +
                " value=" +
                value +
                " actualGUID=" +
                actualGUID +
                " actualGCCode=" +
                actualGCCode
        );
    }
};

export const deleteCommentFromDB = (/** @type {CacheComment} */ comment) => {
    GM_deleteValue(COMPREFIX + comment.guid);
    GM_deleteValue(COMGCPREFIX + comment.gccode);
};

export const doSaveCommentToGUID = (/** @type {CacheComment} */ comment) => {
    comment.saveTime = +new Date();
    doSaveCommentWTimeToGUID(comment);
};

/** @returns {CacheComment} */
export const doLoadCommentFromGUID = (/** @type {string} */ guid) => {
    var c = GCC_getValue(COMPREFIX + guid);

    if (!c) {
        return null;
    }

    return new CacheComment(JSON.parse(c));
};

/** @returns {CacheComment} */
export const doLoadCommentFromGCCode = (/** @type {string} */ gcCode) => {
    var guid = getGUIDFromGCCode(gcCode);
    return doLoadCommentFromGUID(guid);
};

/** @returns {number} */
export const getNumberOfComments = () => {
    var keys = GM_listValues();
    var counter = 0;
    for (var ind = 0; ind < keys.length; ind++) {
        var commentKey = keys[ind];
        if (commentKey.indexOf(COMPREFIX) > -1) counter++;
    }
    return counter;
};
