// event handler import button (#exportDivButton)
import $ from "jquery";
import { html } from "lighterhtml";
import { lang } from "../../../consts/language/language";
import {
    EXPORT_FILTER_ALL,
    EXPORT_FILTER_ARCHIVED,
    EXPORT_FILTER_ARCHIVED_ARCHIVED,
    EXPORT_FILTER_ARCHIVED_BOTH,
    EXPORT_FILTER_ARCHIVED_NOT_ARCHIVED,
    EXPORT_FILTER_FOUND,
    EXPORT_FILTER_SOLVED,
    EXPORT_FILTER_UNSOLVED,
    EXPORT_FILTER_UNTYPED,
    FILTER_TYPE_EXPORT
} from "../../../consts/preferences";
import { getFilteredComments } from "../../../function/db.js";
import { exportMultipleAsJSON } from "../../../function/ImportExport.js";
import { toIsoString } from "../../../helper/date.js";
import { saveFile } from "../../../helper/fileSaver.js";
import { GCC_getValue } from "../../../helper/storage.js";
import { appendCheckBox, appendRadioGroup } from "../../other/controls";

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
    const filteredComments = getFilteredComments(FILTER_TYPE_EXPORT);
    const exportJson = exportMultipleAsJSON(filteredComments);
    saveFile(
        exportJson,
        `gccomment_export_${toIsoString(new Date())}_manual.json`
    );
};

const storeToDrive = () => {
    console.info("storeToDrive");
};

export const generateExportDiv = () => {
    const initFilterOptionsDisabledState = () => {
        setTimeout(toggleExportFilterOptions, 500);
    };

    return html`
        <div
            id="exportDiv"
            style="display:none; margin:5px;padding:10px;outline:1px solid #D7D7D7;position:relative;background-color:#EBECED;column-count: 2; column-rule-width: 1px;column-rule-color: darkgray;column-rule-style: solid;"
        >
            <div
                style="page-break-inside: avoid; break-inside: avoid-column; display: flex;justify-content: center;align-items: center;height: 250px;"
            >
                <input
                    id="driveExportLink"
                    type="button"
                    value="${lang.export_toDrive}"
                    onclick=${storeToDrive}
                />
            </div>
            <div style="page-break-inside: avoid; break-inside: avoid-column;">
                ${lang.export_step1}
                <div id="exportFilterStep1">
                    ${appendCheckBox(
                        EXPORT_FILTER_ALL,
                        lang.all,
                        toggleExportFilterOptions
                    )}
                    ${appendCheckBox(EXPORT_FILTER_UNTYPED, lang.type_untyped)}
                    ${appendCheckBox(
                        EXPORT_FILTER_UNSOLVED,
                        lang.type_unsolved
                    )}
                    ${appendCheckBox(EXPORT_FILTER_SOLVED, lang.type_solved)}
                    ${appendCheckBox(EXPORT_FILTER_FOUND, lang.type_found)}
                </div>

                ${lang.export_step2}
                <div id="exportFilterStep2">
                    ${appendRadioGroup(
                        EXPORT_FILTER_ARCHIVED,
                        [
                            {
                                label: lang.both,
                                attr: EXPORT_FILTER_ARCHIVED_BOTH
                            },
                            {
                                label: lang.not_archived,
                                attr: EXPORT_FILTER_ARCHIVED_NOT_ARCHIVED
                            },
                            {
                                label: lang.archived,
                                attr: EXPORT_FILTER_ARCHIVED_ARCHIVED
                            }
                        ],
                        GCC_getValue(
                            EXPORT_FILTER_ARCHIVED,
                            EXPORT_FILTER_ARCHIVED_BOTH
                        )
                    )}
                </div>

                <p style="margin-top:1.5em">${lang.export_explain}</p>

                <input
                    id="exportButton"
                    type="button"
                    value="${lang.export_perform}"
                    onclick=${performFilteredExport}
                    style="margin:5px"
                />
            </div>
        </div>
        <!-- prettier-ignore -->
        <script>
            ${initFilterOptionsDisabledState}
        </script>
    `;
};
