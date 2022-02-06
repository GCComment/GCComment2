import { COMGCPREFIX, COMPREFIX } from "../consts/general.js";
import { doLoadCommentFromGUID } from "../function/db.js";
import { GCC_getValue, GCC_setValue } from "../helper/storage.js";
import { log } from "./logger.js";

export const doMaintenance = () => {
    var INDEXBUILT = "indexbuilt";
    var INDEXREPAIRED = "indexRepaired";

    // first check whether the index has been created at all. this was introduced
    // in version 46.
    // index means gccode - guid mapping.
    // if the variable is not "done", this index is created.
    if (GCC_getValue(INDEXBUILT) != "done") {
        log(
            "info",
            "Building index for GCCode-GUID assignment. This is done only once after update on version 46"
        );
        var keys = GM_listValues();
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].indexOf(COMPREFIX) >= 0) {
                // we got a comment
                var guid = keys[i].split(COMPREFIX)[1];
                var comment = doLoadCommentFromGUID(guid);
                if (!comment) continue;
                var indexKey = COMGCPREFIX + comment.gccode;
                GCC_setValue(indexKey, guid);
                log("info", indexKey + "=" + guid);
            }
        }
        log("info", "Finished building index.");
        GCC_setValue(INDEXBUILT, "done");
    }

    var indexRepaired = GCC_getValue(INDEXREPAIRED);
    if (!indexRepaired) {
        indexRepaired = 0;
    }

    // repair needed because until 76, only the guid (the actual comment) was
    // deleted, but not the gccode-guid mapping
    if (indexRepaired < 77) {
        log(
            "info",
            "Performing maintenance of version 77. Removing dangling gccode-guid mappings from the GreaseMonkey storage"
        );
        var oComments = {};
        var aGCCodes = [];

        var allkeys = GM_listValues();
        for (var i = 0; i < allkeys.length; i++) {
            if (allkeys[i].indexOf(COMPREFIX) >= 0) {
                // we got a comment
                var guid = allkeys[i].split(COMPREFIX)[1];
                var comment = doLoadCommentFromGUID(guid);
                if (comment) {
                    oComments[comment.gccode] = comment;
                } else {
                    log(
                        "debug",
                        "tried to load from GUID " +
                            guid +
                            ", but nothing was returned."
                    );
                }
            } else if (allkeys[i].indexOf(COMGCPREFIX) >= 0) {
                var gccode = allkeys[i].split(COMGCPREFIX)[1];
                aGCCodes.push(gccode);
            }
        }

        var removeCounter = 0;
        for (i = 0; i < aGCCodes.length; i++) {
            var gccode = aGCCodes[i];
            var comment = oComments[gccode];
            if (!comment) {
                // GCCode without comment ==> delete it
                GM_deleteValue(COMGCPREFIX + gccode);
                log(
                    "info",
                    "Deleted GCCode " +
                        gccode +
                        " because it has no corresponding comment stored"
                );
                removeCounter++;
            }
        }

        log(
            "debug",
            "Maintenance 77 complete. Dangling indexes removed: " +
                removeCounter
        );
        indexRepaired = 77;
    }

    if (indexRepaired < 77) {
        indexRepaired = 77;
    }

    log("debug", "Setting indexRepaired to new value: " + indexRepaired);
    GCC_setValue(INDEXREPAIRED, indexRepaired);
};
