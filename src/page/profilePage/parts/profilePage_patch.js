// event handler delete button (#patchDivButton)
import { html } from "lighterhtml";
import { lang } from "../../../consts/language";
import {
    PATCHGPX_ADDFINALWPT,
    PATCHGPX_CHANGEORIGINAL,
    PATCHGPX_REMOVE_DEFAULTTYPE,
    PATCHGPX_REMOVE_FOUND,
    PATCHGPX_REMOVE_OTHERS,
    PATCHGPX_REMOVE_SOLVED,
    PATCHGPX_REMOVE_UNSOLVED,
    PATCHGPX_STRIP_EMOJIS
} from "../../../consts/preferences";
import { appendCheckBox } from "../../other/controls";

export const generatePatchDiv = () => {
    return html`
        <div id="patchDiv" style="display:none;margin:5px;padding:10px;outline:1px solid #D7D7D7;position:relative;background-color:#EBECED">
            <p>
                ${lang.patchgpx_explain}
            </p>
            <p>
                ${lang.patchgpx_remove}
                <div id="removeUnusedDiv" style="margin-left:20px">
                    ${appendCheckBox(
                        PATCHGPX_REMOVE_OTHERS,
                        lang.patchgpx_filter_nogcc
                    )}
                    ${appendCheckBox(
                        PATCHGPX_REMOVE_DEFAULTTYPE,
                        lang.patchgpx_filter_markeddefaulttype
                    )}
                    ${appendCheckBox(
                        PATCHGPX_REMOVE_UNSOLVED,
                        lang.patchgpx_filter_markednotsolved
                    )}
                    ${appendCheckBox(
                        PATCHGPX_REMOVE_SOLVED,
                        lang.patchgpx_filter_markedsolved
                    )}
                    ${appendCheckBox(
                        PATCHGPX_REMOVE_FOUND,
                        lang.patchgpx_filter_markfound
                    )}
                </div>
            </p>

            ${appendCheckBox(PATCHGPX_CHANGEORIGINAL, lang.patchgpx_changeorig)}
            ${appendCheckBox(
                PATCHGPX_ADDFINALWPT,
                lang.patchgpx_addwptforfinal
            )}
            ${appendCheckBox(PATCHGPX_STRIP_EMOJIS, lang.patchgpx_stripemojis)}

            <input id="input" name="files[]" type="file" onchange=${onInputChanged} style="margin:3px"/>
            <input id="patchndownload" value="${
                lang.patchgpx_perform
            }" disabled type="button" style="margin:3px"/>
            <div id="patchResultDiv" />
        </div>
    `;
};

const onInputChanged = (evt) => {
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();
    reader.onload = ((theFile) => {
        return (e) => {
            handleGPXFileSelected(file.name, e.target.result);
        };
    })(file);
    if (file.name.indexOf(".gpx") > 0) {
        reader.readAsText(file);
    }
};
