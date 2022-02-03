export const appendCSS = (/** @type {string} */ type, /** @type {string} */ css, /** @type {Document} */ context) => {
    var element = document.createElement('style');
    element.setAttribute('type', 'text/css');
    if (type == 'src') {
        element.setAttribute('src', css);
    } else if (type == 'text') {
        element.textContent = css;
    }
    context = context || document;
    context.getElementsByTagName('head')[0].appendChild(element);
    return element;
}