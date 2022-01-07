
export const appendScript = function (type, script, context) {
    var element = document.createElement('script');
    element.setAttribute('type', 'text/javascript');
    if (type == 'src') {
        element.setAttribute('src', script);
    } else if (type == 'text') {
        element.textContent = script;
    }
    context = context || document;
    context.getElementsByTagName('head')[0].appendChild(element);
    return element;
}

export const addEvent = function (obj, type, fn) {
    if (obj.addEventListener){
        obj.addEventListener(type, fn, false);
    }
    else if (obj.attachEvent){
        obj.attachEvent('on' + type, function () {
            return fn.apply(obj, new Array(window.event));
        });
    }
}