// event handler import button (#exportDivButton)
import $ from "jquery";
import { lang } from "../../../consts/language";
import { html } from "lighterhtml";
import {
    EXPORT_FILTER_ALL,
    EXPORT_FILTER_ARCHIVE,
    EXPORT_FILTER_ARCHIVE_ARCHIVED,
    EXPORT_FILTER_ARCHIVE_BOTH,
    EXPORT_FILTER_ARCHIVE_NOT_ARCHIVED,
    EXPORT_FILTER_FOUND,
    EXPORT_FILTER_SOLVED,
    EXPORT_FILTER_UNSOLVED,
    EXPORT_FILTER_UNTYPED
} from "../../../consts/preferences";
import { appendCheckBox, appendRadioGroup } from "../../other/controls";
import { GCC_getValue } from "../../../helper/storage.js";

const toggleExportFilterOptions = () => {
    if (GCC_getValue(EXPORT_FILTER_ALL)) {
        $("#EXPORT_FILTER_UNTYPED").attr("disabled", "disabled");
        $("#EXPORT_FILTER_UNSOLVED").attr("disabled", "disabled");
        $("#EXPORT_FILTER_SOLVED").attr("disabled", "disabled");
        $("#EXPORT_FILTER_FOUND").attr("disabled", "disabled");
    } else {
        $("#EXPORT_FILTER_UNTYPED").removeAttr("disabled");
        $("#EXPORT_FILTER_UNSOLVED").removeAttr("disabled");
        $("#EXPORT_FILTER_SOLVED").removeAttr("disabled");
        $("#EXPORT_FILTER_FOUND").removeAttr("disabled");
    }
};

const performFilteredExport = () => {
    console.info("performFilteredExport");
};
//TODO: Remove
const performFilteredDropboxExport = () => {
    console.info("performFilteredDropboxExport");
};
const storeToDropbox = () => {
    console.info("storeToDropbox");
};

export const generateExportDiv = () => {
    const initFilterOptionsDisabledState = () => {
        setTimeout(toggleExportFilterOptions, 500);
    };

    return html`
        <div
            id="exportDiv"
            style="display:none; margin:5px;padding:10px;outline:1px solid #D7D7D7;position:relative;background-color:#EBECED"
        >
            ${lang.export_step1}
            <div id="exportFilterStep1">
                ${appendCheckBox(
                    EXPORT_FILTER_ALL,
                    lang.all,
                    toggleExportFilterOptions
                )}
                ${appendCheckBox(EXPORT_FILTER_UNTYPED, lang.type_untyped)}
                ${appendCheckBox(EXPORT_FILTER_UNSOLVED, lang.type_unsolved)}
                ${appendCheckBox(EXPORT_FILTER_SOLVED, lang.type_solved)}
                ${appendCheckBox(EXPORT_FILTER_FOUND, lang.type_found)}
            </div>

            ${lang.export_step2}
            <div id="exportFilterStep2">
                ${appendRadioGroup(
                    EXPORT_FILTER_ARCHIVE,
                    [
                        {
                            label: lang.both,
                            attr: EXPORT_FILTER_ARCHIVE_BOTH
                        },
                        {
                            label: lang.not_archived,
                            attr: EXPORT_FILTER_ARCHIVE_NOT_ARCHIVED
                        },
                        {
                            label: lang.archived,
                            attr: EXPORT_FILTER_ARCHIVE_ARCHIVED
                        }
                    ],
                    GCC_getValue(
                        EXPORT_FILTER_ARCHIVE,
                        EXPORT_FILTER_ARCHIVE_BOTH
                    )
                )}
            </div>

            ${lang.export_step3}
            <div id="exportFilterStep3">
                <select
                    id="exportTypeSelector"
                    name="exportTypeSelector"
                    size="1"
                >
                    <option selected>GCC</option>
                    <option>GPX</option>
                    <option>HTML</option>
                    <option>KML</option>
                    <option>JSON</option>
                </select>
            </div>

            <p style="margin-top:1.5em">${lang.export_explain}</p>

            <input
                id="exportButton"
                type="button"
                value="${lang.export_perform}"
                onclick=${performFilteredExport}
                style="margin:5px"
            />
            <input
                id="exportDropboxButton"
                type="button"
                value="${lang.export_toDropboxPerformFilteredExport}"
                onclick=${performFilteredDropboxExport}
                style="margin:5px"
            />
            <input
                id="dropboxExportLink"
                type="button"
                value="${lang.export_toDropbox}"
                onclick=${storeToDropbox}
                style="margin:5px"
            />

            <a
                id="dropboxAuthLinkExport"
                href="https://www.dropbox.com/"
                style="display: none"
                >Auth with DropBox</a
            >
        </div>
        <!-- prettier-ignore -->
        <script>
            ${initFilterOptionsDisabledState}
        </script>
    `;
};
