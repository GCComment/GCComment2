import { saveAs } from "file-saver";

export const saveFile = (
    /** @type {string} */ fileContent,
    /** @type {string} */ fileName
) => {
    var blob = new Blob([fileContent], {
        type: "application/json;charset=utf-8"
    });
    saveAs(blob, fileName);
};
