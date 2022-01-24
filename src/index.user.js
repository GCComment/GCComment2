import $ from 'jquery';
import { log } from './helper/logger.js';
import { gccommentOnDetailpage } from './page/detailPage/detailPage.js';
import { gccommentOnHidePage } from './page/hidePage/hidePage.js';
import { gccommentOnMapPage } from './page/mapPage/mapPage.js';
import { gccommentOnNewMapPage } from './page/mapPage/newMapPage.js';
import { addCommentBubblesToPage } from './page/other/addCommentBubblesToPage.js';
import { gccommentOnProfilePage } from './page/profilePage/profilePage.js';

$(() =>{
    // starting the GCC
    log('debug', 'found URL: ' + document.URL);
    if ((document.URL.search("cache_details\.aspx") >= 0) || (document.URL.search("\/geocache\/GC") >= 0)) {
        log('debug', 'matched gccommentOnDetailpage');
        gccommentOnDetailpage();
    } else if ((document.URL.search("\/my\/logs\.aspx") >= 0)
        || (document.URL.search("\/seek\/nearest\.aspx") >= 0)
        || (document.URL.search("\/watchlist\.aspx") >= 0)
        || (document.URL.search("\/my\/recentlyviewedcaches\.aspx") >= 0)
        || (document.URL.search("\/bookmarks\/view\.aspx") >= 0)) {
        log('debug', 'matched addCommentBubblesToPage');
        addCommentBubblesToPage();
    } else if (document.URL.search("cdpf\.aspx") >= 0) {
        log('debug', 'matched gccommentOnPrintPage');
        gccommentOnPrintPage();
    } else if ((document.URL.search("\/my\/default\.aspx") >= 0) || (document.URL.search("\/my\/$") >= 0)
        || (document.URL.search("\/my\/\#") >= 0) || (document.URL.search("\/my\/\\?.*=.*") >= 0)) {
        log('debug', 'matched gccommentOnProfilePage');
        gccommentOnProfilePage(false);
    } else if ((document.URL.search("\/account\/dashboard") >= 0) || (document.URL.search("\/dashboard\/$") >= 0)
        || (document.URL.search("\/dashboard\/\#") >= 0) || (document.URL.search("\/dashboard\/\\?.*=.*") >= 0)) {
        log('debug', 'matched gccommentOnNewProfilePage');
        gccommentOnProfilePage(true);
    } else if (document.URL.search("www.geocaching.com\/map") >= 0) {
        log('debug', 'matched gccommentOnMapPage');
        gccommentOnMapPage();
    }
    else if (document.URL.search("www.geocaching.com\/play\/map") >= 0) {
        log('debug', 'matched gccommentOnNewMapPage');
        gccommentOnNewMapPage();
    } else if (document.URL.search("\/sendtogps\.aspx") >= 0) {
        log('debug', 'matched sendToGPS');
        sendToGPS();
    } else if (document.URL.search("www.geocaching.com\/account\/settings\/homelocation") >= 0) {
        log('debug', 'matched gccommentOnManageLocations');
        gccommentOnManageLocations();
    } else if (document.URL.search("\/seek\/log\.aspx") >= 0) {
        log('debug', 'matched gccommentOnLogPage');
        gccommentOnLogPage();
    } else if (document.URL.search("\/play\/geocache\/") >= 0) {
        log('debug', 'matched gccommentOnNewLogPage');
        gccommentOnNewLogPage();
    } else if (document.URL.search("\/hide\/planning") >= 0) {
        log('debug', 'matched gccommentOnHidePage');
        gccommentOnHidePage();
    } else if (document.URL.search("lukeiam\.github\.io\/gcc") >= 0) {
        log('debug', 'matched gccommentOnSharingPage');
        gccommentOnSharingPage();
    } else {
        log('debug', 'nothing matched');
    }
});