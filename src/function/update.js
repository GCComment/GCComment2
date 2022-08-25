import $ from "jquery";
import { html, render } from "lighterhtml";
import { lang } from "../consts/language/language";
import { log } from "../helper/logger.js";
import { GCC_getValue, GCC_setValue } from "../helper/storage.js";
import { versionCompare } from "../helper/versionCompare.js";
import { updatechangesurl, updateurl, version } from "../helper/versionInfo.js";

const updateAvailable = (oChanges) => {
    log(
        "info",
        "current version: " +
            version +
            " latest version: " +
            oChanges.latestVersion
    );

    var aNewChanges = oChanges.changes.filter((oChange) => {
        return oChange.version > version;
    });

    render(
        $("#gccupdateinfo")[0],
        html`
            <span>
                ${lang.tmpl_update
                    .replace("{{serverVersion}}", oChanges.latestVersion)
                    .replace("{{version}}", version)}
            </span>
            <br />
            <a href=${updateurl}>${lang.update_clickToUpdate}</a>
            <br />
            <br />
            ${aNewChanges.map(
                (u) => html`
                    <span>
                        ${lang.update_changes + u.version + " (" + u.date + ")"}
                    </span>
                    <br />
                    <div>
                        <ul>
                            ${u.change.map((elem) => html`<li>${elem}</li>`)}
                        </ul>
                    </div>
                `
            )}
            <br />
        `
    );
};

export const checkForUpdates = () => {
    var updateDateString = GCC_getValue("updateDate");
    var updateDate = null;
    if (updateDateString && updateDateString != "NaN") {
        updateDate = new Date(parseInt(updateDateString));
    } else {
        updateDate = new Date();
        var newDate = "" + (updateDate - 0);
        GCC_setValue("updateDate", newDate);
    }
    var currentDate = new Date();

    // in ms. equals 1 day
    if (currentDate - updateDate > 14400000) {
        GM_xmlhttpRequest({
            method: "GET",
            headers: {
                "Cache-Control": "max-age=3600, must-revalidate"
            },
            url: updatechangesurl,
            onload: (responseDetails) => {
                try {
                    var oChanges = JSON.parse(responseDetails.responseText);
                    var serverVersion = oChanges.latestVersion;
                    log(
                        "info",
                        "updatecheck: installed version=" +
                            version +
                            ", server version=" +
                            serverVersion
                    );
                    if (versionCompare(serverVersion, version) > 0) {
                        updateAvailable(oChanges);
                    }
                } catch (JSONException) {
                    log(
                        "error",
                        "Could not load update info: " + JSONException
                    );
                }
            },
            onerror: (responseDetails) => {
                log(
                    "info",
                    "Unable to get version from Github! Errorcode " +
                        responseDetails.status
                );
            }
        });
        GCC_setValue("updateDate", "" + (currentDate - 0));
    }
};
