// event handler import button (#importDivButton)
import Dropzone from "dropzone";
// @ts-ignore
// css hack
import dropzoneCss from "bundle-text:dropzone/dist/dropzone.css";
import { html } from "lighterhtml";
import { lang } from "../../../consts/language/language";
import {
    importMultipleFromJSON,
    parseXMLImport
} from "../../../function/importExport.js";
import { appendCSS } from "../../../helper/css.js";
import { log } from "../../../helper/logger.js";

//TODO: Remove dropbox
const updateDriveList = () => {
    console.info("updateDriveList");
};
//TODO: Remove dropbox
const loadFromDrive = () => {
    console.info("loadFromDrive");
};

const initImport = () => {
    setTimeout(initDropzone, 10);
};

export const generateImportDiv = () => {
    return html`
        <div
            id="importDiv"
            style="display:none; margin:5px;padding:10px;outline:1px solid #D7D7D7;position:relative;background-color:#EBECED"
        >
            <p>${lang.import_explain}</p>
            <div style="column-count: 2;">
                <div
                    style="page-break-inside: avoid; break-inside: avoid-column; display: flex;justify-content: center;align-items: center;height: 200px;"
                >
                    <input
                        id="driveCheck"
                        type="button"
                        value="${lang.import_updateDriveList}"
                        onclick=${updateDriveList}
                    />
                    <div style="display:none;">
                        <select id="driveSelect" />
                        <br />
                        <input
                            id="driveImport"
                            type="button"
                            disabled
                            value="${lang.import_fromDrive}"
                            onclick=${loadFromDrive}
                        />
                    </div>
                </div>
                <div
                    style="page-break-inside: avoid; break-inside: avoid-column;"
                >
                    <div id="importDropzone" class="dropzone">
                        <div class="dz-message" data-dz-message>
                            <span>${lang.import_choose}</span>
                        </div>
                    </div>
                    <input
                        id="submitImportButton"
                        type="button"
                        value="${lang.import_perform}"
                        onclick=${performImport}
                        style="margin:5px"
                    />
                    <input
                        id="cancelImportButton"
                        type="button"
                        value="${lang.import_close}"
                        onclick=${cancelImport}
                        style="margin:5px"
                    />
                </div>
            </div>
        </div>
        <!-- prettier-ignore -->
        <script>
            ${initImport}
        </script>
    `;
};

/**
 * @type {Dropzone}
 */
var dropZone = null;
var currentDropFile = null;

const initDropzone = () => {
    appendCSS("text", dropzoneCss);
    appendCSS("text", ".dz-progress{ display:none; }");

    dropZone = new Dropzone("div#importDropzone", {
        url: "https://localhost/dummy",
        paramName: "file",
        maxFilesize: 2048,
        createImageThumbnails: false,
        maxFiles: 1,
        autoProcessQueue: false,
        autoQueue: false,
        acceptedFiles: "application/json,application/xml,.gcc"
    });
    dropZone.on("addedfile", handleFileDrop);
};

const handleFileDrop = (file) => {
    currentDropFile = file;
};

const cancelImport = () => {
    dropZone.removeAllFiles();
    currentDropFile = null;
};

const performImport = () => {
    console.info("performImport");

    const reader = new FileReader();
    reader.onload = (event) => {
        const dataText = String(event.target.result);

        var inputResult = importMultipleFromJSON(dataText);
        if (inputResult === null) {
            log("info", "fallback to xml import");
            parseXMLImport(dataText);
        }
        dropZone.removeAllFiles();
        currentDropFile = null;
        console.info("performImport end");
    };
    reader.readAsText(currentDropFile, "UTF-8");
};
