
import {log} from "../helper/logger.js"
import {lang} from "../consts/language.js"
import {GCC_setValue} from "../helper/storage.js"
import {updatechangesurl, updateurl, version} from "../helper/versionInfo.js"
import {GCC_getValue} from "../helper/storage.js"

export const updateCheck = () =>{
    //Update check
    if ((document.URL.search("\/my\/default\.aspx") >= 0) || (document.URL.search("\/my\/$") >= 0)
                    || (document.URL.search("\/my\/\#") >= 0) || (document.URL.search("\/my\/\\?.*=.*") >= 0)) {       
        function updateAvailable(oChanges) {
            log("info", "current version: " + version + " latest version: " + oChanges.latestVersion);
            var updateInfo = document.createElement('div');
            updateInfo.setAttribute('id', 'gccupdateinfo');
            var updatelnk = document.createElement('a');

            updatelnk.setAttribute('href', updateurl);

            updatelnk.innerHTML = lang.update_clickToUpdate;
            updateInfo.appendChild(document.createTextNode(lang.tmpl_update.replace("{{serverVersion}}",
                    oChanges.latestVersion).replace("{{version}}", version)
                    + " "));
            updateInfo.appendChild(updatelnk);
            updateInfo.appendChild(document.createElement('br'));
            updateInfo.appendChild(document.createElement('br'));
            document.getElementById("gccRoot").insertBefore(updateInfo, document.getElementById("gccRoot").firstChild);

            var aNewChanges = oChanges.changes.filter((oChange) => {
                return oChange.version > version;
            });

            aNewChanges.forEach((oChange) => {
                updateInfo.appendChild(document.createTextNode(lang.update_changes + oChange.version + " ("
                        + oChange.date + ")"));
                updateInfo.appendChild(document.createElement('br'));

                var divv = document.createElement('div');
                divv.innerHTML = oChange.change;
                updateInfo.appendChild(divv);
            });
        }

        function checkforupdates() {
            var updateDateString = GCC_getValue('updateDate');
            var updateDate = null;
            if (updateDateString && (updateDateString != "NaN")) {
                updateDate = new Date(parseInt(updateDateString));
            } else {
                updateDate = new Date();
                var newDate = "" + (updateDate - 0);
                GCC_setValue('updateDate', newDate);
            }
            var currentDate = new Date();

            // in ms. equals 1 day
            if (currentDate - updateDate > 14400000) {

                GM_xmlhttpRequest({
                    method : 'GET',
                    headers : {
                        'Cache-Control' : 'max-age=3600, must-revalidate'
                    },
                    url : updatechangesurl,
                    onload : (responseDetails) => {
                        try {
                            var oChanges = JSON.parse(responseDetails.responseText);
                            var serverVersion = oChanges.latestVersion;
                            log('info', 'updatecheck: installed version=' + version + ", server version=" + serverVersion);
                            if (serverVersion > version) {
                                updateAvailable(oChanges);
                            }
                        } catch (JSONException) {
                            log("error", "Could not load update info: " + JSONException);
                        }
                    },
                    onerror : (responseDetails) => {
                        log("info", "Unable to get version from Github! Errorcode " + responseDetails.status);
                    }
                });
                GCC_setValue('updateDate', "" + (currentDate - 0));
            }
        }

        checkforupdates();
    }
}