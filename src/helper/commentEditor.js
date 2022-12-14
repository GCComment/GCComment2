import { Editor } from "@toast-ui/editor";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import $ from "jquery";

const sanitize = (content) => {
    // TODO add sanitize if required
    // (TUI editor already takes care of the most stuff)
    return content;
};

/** @returns {Editor} */
export const createEditor = (div, content) => {
    const editor = new Editor({
        el: div,
        height: "500px",
        initialEditType: "wysiwyg",
        previewStyle: "tab",
        initialValue: sanitize(content),
        usageStatistics: false
    });
    editor.removeToolbarItem("image");
    return editor;
};

/** @returns {Viewer} */
export const createViewer = (div, content) => {
    const viewer = new Viewer({
        el: div,
        initialValue: sanitize(content),
        usageStatistics: false
    });

    return viewer;
};

/** @returns {Viewer} */
export const createViewerFromDivDataAttr = (div) => {
    const viewer = new Viewer({
        el: div,
        initialValue: sanitize($(div).attr("data")),
        usageStatistics: false
    });

    return viewer;
};

/** @type {Editor} */
var mdRenderViewer = null;

export const getHtmlFromMarkdown = (markdown) => {
    if (!mdRenderViewer) {
        $(document.body).append(
            '<div id="mdRenderViewer" style="display:none;"></div>'
        );
        mdRenderViewer = new Editor({
            el: $("#mdRenderViewer")[0],
            usageStatistics: false
        });
    }

    mdRenderViewer.setMarkdown(markdown);

    return mdRenderViewer.getHTML();
};
