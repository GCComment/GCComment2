// event handler import button (#importDivButton)
import $ from "jquery";
import { html } from "lighterhtml";
import { lang } from "../../../consts/language";
import { parseImport } from "../../../function/ImportExport.js";
import { toggleTabOnProfile } from "../profilePage.js";

//TODO: Remove dropbox
const checkDropbox = () => {
    console.info("checkDropbox");
};
//TODO: Remove dropbox
const loadFromDropbox = () => {
    console.info("loadFromDropbox");
};

const performImport = () => {
    console.info("performImport");
    parseImport($("#gccommentimporttextarea").val());
    $("#gccommentimporttextarea").val("");
    console.info("performImport end");
};

export const generateImportDiv = () => {
    return html`
        <div
            id="importDiv"
            style="display:none; margin:5px;padding:10px;outline:1px solid #D7D7D7;position:relative;background-color:#EBECED"
        >
            <p>${lang.import_explain}</p>

            ${lang.import_choose}
            <input
                id="fileinput"
                name="files[]"
                onchange=${onFileinputChanged}
                type="file"
            />

            <br />

            <input
                id="dropboxCheck"
                type="button"
                value="${lang.import_fromDropboxCheckForFiles}"
                onmouseup=${checkDropbox}
            />
            <select id="dropboxSelect" />
            <input
                id="dropboxImportLink"
                type="button"
                disabled
                value="${lang.import_fromDropbox}"
                onmouseup=${loadFromDropbox}
            />

            <a
                id="dropboxAuthLinkExport"
                href="https://www.dropbox.com/"
                style="display:none"
                >Auth with DropBox</a
            >

            <br />
            <textarea
                id="gccommentimporttextarea"
                cols="100"
                rows="10"
                style="margin-top: 0.5em;"
            />
            <br />
            <input
                id="submitImportButton"
                type="button"
                value="${lang.import_perform}"
                onmouseup=${performImport}
                style="margin:5px"
            />

            <input
                id="cancelImportButton"
                type="button"
                value="${lang.import_close}"
                onmouseup=${onCancelImportButtonMouseUp}
                style="margin:5px"
            />

            <p id="importresult" />
        </div>
    `;
};

const onCancelImportButtonMouseUp = () => {
    $("#importresult")[0].innerHTML = "";
    toggleTabOnProfile("importDiv");
};

const onFileinputChanged = (evt) => {
    const files = evt.target.files;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = ((theFile) => {
        return (e) => {
            $("#gccommentimporttextarea").val(String(e.target.result));
        };
    })(file);
    if (file.name.indexOf(".gcc") > 0) reader.readAsText(file);
};
