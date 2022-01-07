import  { Editor } from '@toast-ui/editor';
import  Viewer  from '@toast-ui/editor/dist/toastui-editor-viewer';


const sanitize = (content) =>{
    // TODO
    return content;
} 

export const createEditor = (div, content) => {
    const editor = new Editor({
        el: div,
        height: '500px',
        initialEditType: 'wysiwyg',
        previewStyle: 'tab',
        initialValue: sanitize(content),
        usageStatistics: false,
    });

    /*
    editor.insertToolbarItem({ groupIndex: 0, itemIndex: 0 }, {
        name: 'closeFullscreen',
        tooltip: 'Close Fullscreen Editor',
        command: 'bold',
        text: 'X',
        className: 'toastui-editor-toolbar-icons first',
        style: { backgroundImage: 'none', display: 'none' } // TODO Close icon
    });
    */

    return editor;
} /** @type {Viewer} */ ;

export const createViewer = (div, content) => {
    const viewer = new Viewer({
        el: div,
        initialValue: sanitize(content),
        usageStatistics: false,
    });   

    return viewer;
} /** @type {Viewer} */ ;