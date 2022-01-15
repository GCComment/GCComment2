import  { Editor } from '@toast-ui/editor';
import  Viewer  from '@toast-ui/editor/dist/toastui-editor-viewer';


const sanitize = (content) =>{
    // TODO
    return content;
} 

/** @type {Editor} */ ;
export const createEditor = (div, content) => {
    const editor = new Editor({
        el: div,
        height: '500px',
        initialEditType: 'wysiwyg',
        previewStyle: 'tab',
        initialValue: sanitize(content),
        usageStatistics: false,
    });

    return editor;
} 

 /** @type {Viewer} */ ;
export const createViewer = (div, content) => {
    const viewer = new Viewer({
        el: div,
        initialValue: sanitize(content),
        usageStatistics: false,
    });   

    return viewer;
}