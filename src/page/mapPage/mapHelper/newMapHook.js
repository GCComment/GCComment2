import $ from 'jquery';

var initialized = false;
var callbacks = [];

const waitForEl = function(selector, callback) {
    if ($(selector).length) {
        callback();
    } else {
        setTimeout(function() {
        waitForEl(selector, callback);
        }, 100);
    }
};

const getReactFiber = (elem) => {
    const keys = Object.keys(elem).filter(function(k) {
        return k.indexOf('__reactFiber') == 0;
    });
    if (keys.length == 0){
        return null;
    }
    return elem[keys[0]];  
};

const getCacheData = () => {
    const elem = $('#geocache-list');
    if (elem.length == 0){
        return [];
    }
    const react_node = getReactFiber(elem[0]);
    return react_node.return.memoizedProps.results;
};

const init = (callback) =>{
    $("#clear-map-control").on("click", ()=>{
        setTimeout(() => callback(getCacheData()), 500);

    });
    var filterHookAdded = false;
    $('.gc-filter-toggle').on("click", ()=>{
        if(!filterHookAdded){      
            waitForEl(".gc-search-filter-controls > .gc-button-primary", () =>{
                $(".gc-search-filter-controls > .gc-button-primary").on("click", ()=>{
                    setTimeout(() => callback(getCacheData()), 500);

                });
            });
            filterHookAdded = true;
        }
    });
    setTimeout(() => callback(getCacheData()), 500);
};

const callback_handler = (cacheData) => {
    callbacks.forEach(func => {
        func(cacheData);
    });
}

export const subscribeForCacheChanges = (callback) => {
    callbacks.push(callback);
    if(!initialized){
        setTimeout(()=>{
            waitForEl(".geocache-item-data", () => init(callback_handler));
        }, 1);
        initialized = true;
    }
};