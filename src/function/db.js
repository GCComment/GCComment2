import { COMGCPREFIX, COMPREFIX } from "../consts/general.js";
import {
    DELETEALL_FILTER_ALL,
    DELETEALL_FILTER_ARCHIVED,
    DELETEALL_FILTER_ARCHIVED_ARCHIVED,
    DELETEALL_FILTER_ARCHIVED_BOTH,
    DELETEALL_FILTER_ARCHIVED_NOT_ARCHIVED,
    DELETEALL_FILTER_FOUND,
    DELETEALL_FILTER_SOLVED,
    DELETEALL_FILTER_UNSOLVED,
    DELETEALL_FILTER_UNTYPED,
    EXPORT_FILTER_ALL,
    EXPORT_FILTER_ARCHIVED,
    EXPORT_FILTER_ARCHIVED_ARCHIVED,
    EXPORT_FILTER_ARCHIVED_BOTH,
    EXPORT_FILTER_ARCHIVED_NOT_ARCHIVED,
    EXPORT_FILTER_FOUND,
    EXPORT_FILTER_SOLVED,
    EXPORT_FILTER_UNSOLVED,
    EXPORT_FILTER_UNTYPED,
    FILTER_TYPE_DELETE,
    FILTER_TYPE_EXPORT,
    UNTYPED_FILTER_ALL,
    UNTYPED_FILTER_ARCHIVED,
    UNTYPED_FILTER_ARCHIVED_ARCHIVED,
    UNTYPED_FILTER_ARCHIVED_BOTH,
    UNTYPED_FILTER_ARCHIVED_NOT_ARCHIVED,
    UNTYPED_FILTER_FOUND,
    UNTYPED_FILTER_SOLVED,
    UNTYPED_FILTER_UNSOLVED,
    UNTYPED_FILTER_UNTYPED
} from "../consts/preferences.js";
import { CacheComment } from "../dataClasses/cacheComment.js";
import { StateEnum } from "../dataClasses/stateEnum";
import { getGUIDFromGCCode } from "../helper/gccode.js";
import { log } from "../helper/logger.js";
import { GCC_getValue, GCC_setValue } from "../helper/storage.js";

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

/**
 *
 * @returns {CacheComment[]} list containing all comments.
 */
export const getAllComments = () => {
    var commentList = [];
    var keys = GM_listValues();
    var counter = 0;
    for (var ind = 0; ind < keys.length; ind++) {
        var commentKey = keys[ind];
        if (commentKey.indexOf(COMPREFIX) > -1) {
            commentList.push(
                new CacheComment(JSON.parse(GCC_getValue(commentKey)))
            );
        }
    }
    return commentList;
};

const getTypedFilter = (untypedFilter, type) => {
    if (type === FILTER_TYPE_EXPORT) {
        if (untypedFilter === UNTYPED_FILTER_ALL) {
            return EXPORT_FILTER_ALL;
        }
        if (untypedFilter === UNTYPED_FILTER_UNTYPED) {
            return EXPORT_FILTER_UNTYPED;
        }
        if (untypedFilter === UNTYPED_FILTER_UNSOLVED) {
            return EXPORT_FILTER_UNSOLVED;
        }
        if (untypedFilter === UNTYPED_FILTER_SOLVED) {
            return EXPORT_FILTER_SOLVED;
        }
        if (untypedFilter === UNTYPED_FILTER_FOUND) {
            return EXPORT_FILTER_FOUND;
        }
        if (untypedFilter === UNTYPED_FILTER_ARCHIVED) {
            return EXPORT_FILTER_ARCHIVED;
        }
        if (untypedFilter === UNTYPED_FILTER_ARCHIVED_BOTH) {
            return EXPORT_FILTER_ARCHIVED_BOTH;
        }
        if (untypedFilter === UNTYPED_FILTER_ARCHIVED_ARCHIVED) {
            return EXPORT_FILTER_ARCHIVED_ARCHIVED;
        }
        if (untypedFilter === UNTYPED_FILTER_ARCHIVED_NOT_ARCHIVED) {
            return EXPORT_FILTER_ARCHIVED_NOT_ARCHIVED;
        }
        log("info", `Unknown untyped filter: ${untypedFilter}`);
        return null;
    } else if (type === FILTER_TYPE_DELETE) {
        if (untypedFilter === UNTYPED_FILTER_ALL) {
            return DELETEALL_FILTER_ALL;
        }
        if (untypedFilter === UNTYPED_FILTER_UNTYPED) {
            return DELETEALL_FILTER_UNTYPED;
        }
        if (untypedFilter === UNTYPED_FILTER_UNSOLVED) {
            return DELETEALL_FILTER_UNSOLVED;
        }
        if (untypedFilter === UNTYPED_FILTER_SOLVED) {
            return DELETEALL_FILTER_SOLVED;
        }
        if (untypedFilter === UNTYPED_FILTER_FOUND) {
            return DELETEALL_FILTER_FOUND;
        }
        if (untypedFilter === UNTYPED_FILTER_ARCHIVED) {
            return DELETEALL_FILTER_ARCHIVED;
        }
        if (untypedFilter === UNTYPED_FILTER_ARCHIVED_BOTH) {
            return DELETEALL_FILTER_ARCHIVED_BOTH;
        }
        if (untypedFilter === UNTYPED_FILTER_ARCHIVED_ARCHIVED) {
            return DELETEALL_FILTER_ARCHIVED_ARCHIVED;
        }
        if (untypedFilter === UNTYPED_FILTER_ARCHIVED_NOT_ARCHIVED) {
            return DELETEALL_FILTER_ARCHIVED_NOT_ARCHIVED;
        }
        log("info", `Unknown untyped filter: ${untypedFilter}`);
        return null;
    } else {
        log("info", `Unknown filter type: ${type}`);
        return null;
    }
};

export const getFilteredComments = (filterType) => {
    var filteredComments = [];
    const allComments = getAllComments();
    for (var i = 0; i < allComments.length; i++) {
        var comment = allComments[i];
        var archiveSetting = GM_getValue(
            getTypedFilter(UNTYPED_FILTER_ARCHIVED, filterType)
        );

        var includeArchive =
            archiveSetting ===
                getTypedFilter(UNTYPED_FILTER_ARCHIVED_BOTH, filterType) ||
            (archiveSetting ===
                getTypedFilter(UNTYPED_FILTER_ARCHIVED_ARCHIVED, filterType) &&
                comment.archived) ||
            (archiveSetting ===
                getTypedFilter(
                    UNTYPED_FILTER_ARCHIVED_NOT_ARCHIVED,
                    filterType
                ) &&
                !comment.archived);

        if (
            (GM_getValue(getTypedFilter(UNTYPED_FILTER_ALL, filterType)) &&
                includeArchive) ||
            (GM_getValue(getTypedFilter(UNTYPED_FILTER_UNTYPED, filterType)) &&
                comment.state === StateEnum.unknown &&
                includeArchive) ||
            (GM_getValue(getTypedFilter(UNTYPED_FILTER_UNSOLVED, filterType)) &&
                comment.state === StateEnum.unsolved &&
                includeArchive) ||
            (GM_getValue(getTypedFilter(UNTYPED_FILTER_SOLVED, filterType)) &&
                comment.state === StateEnum.solved &&
                includeArchive) ||
            (GM_getValue(getTypedFilter(UNTYPED_FILTER_FOUND, filterType)) &&
                comment.state === StateEnum.found &&
                includeArchive)
        ) {
            filteredComments.push(comment);
        }
    }
    return filteredComments;
};
