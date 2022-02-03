import $ from "jquery";
import {
    SETTINGS_LANGUAGE,
    SETTINGS_LANGUAGE_AUTO,
    SETTINGS_LANGUAGE_DE,
    SETTINGS_LANGUAGE_EN
} from "./preferences.js";
import { GCC_getValue } from "../helper/storage.js";

var _languages = {};

_languages[SETTINGS_LANGUAGE_EN] = {
    mycomments: "My comments",
    mycomment: "My comment",
    myfinalcoords: "My final coordinates",
    and: "and",
    both: "both",
    nothing: "nothing",
    archived: "archived",
    not_archived: "not archived",
    never: "never",
    download: "Download",
    finale: "Final",
    final_coordinate: "Final coordinate",
    final_location: "Final location",
    final_location_byGCC: "Final location by GCC",
    menu_options: "Show options",
    menu_showmycomments: "Show my comments",
    menu_export: "Export",
    menu_import: "Import",
    menu_delete: "Delete",
    menu_patchgpx: "Patch GPX",
    type_untyped: "untyped",
    type_unsolved: "unsolved",
    type_solved: "solved",
    type_found: "found",
    type_archived: "archived",
    ov_totalamount: "Total amount",
    ov_amountarchive: "Amount of them in archive",
    ov_lastex: "Last export",
    ov_lastim: "Last import",
    ov_lastup: "Last check for updates",
    settings_intro:
        "Thanks for using GCComment. Visit <a href='https://github.com/Birnbaum2001/GCComment' target='blank'>github.com</a> for general information and documentation or <a href='http://www.geoclub.de/viewtopic.php?f=117&t=44631' target='blank'>geoclub.de</a> for discussions & feedback. If you have direct feedback or questions, contact us at <a href='mailto:ramirez_@online.de'>ramirez_@online.de</a> or <a href='mailto:birnbaum2001@gmx.de'>birnbaum2001@gmx.de</a>.",
    settings_feelfree: "Feel free to show your appreciation :)",
    settings_enterUUID: "UUID for server synchronisation",
    settings_enterServer: "Server for server synchronisation",
    settings_allowExport:
        "Allow export of comment data to other scripts (e.g., GC Tour)",
    settings_lazyTable:
        "Lazy table refresh (no update on state change or delete from overview)",
    settings_syncWithGS:
        "When saving the final coordindates, also correct coordinates at Groundspeak",
    settings_saveCacheNotes:
        "When saving comments, also upload them as Groundspeak cache notes",
    settings_saveprefs: "Save preferences",
    settings_language: "Language",
    thank_you: "Thank you",
    table_comments: "My comment & final coordinates",
    table_lastsave: "Last save",
    table_actions: "Actions",
    table_ihaveit: "I have the final coordinates :)",
    table_isarchived: "This cache is archived",
    table_fromhome: "from home",
    table_markcacheas: "Mark cache as",
    table_editondetail: "Edit on Detail page",
    table_removefromarchive: "Remove from archive",
    table_addtoarchive: "Add to archive",
    table_finalat: "Final at ",
    table_filter_all: "Show all",
    table_filter_untyped: "Show all untyped",
    table_filter_unsolved: "Show all unsolved",
    table_filter_solved: "Show all solved",
    table_filter_found: "Show all found",
    table_filter_archived: "Show all archived",
    table_filtered_by: "Filtered by",
    export_step1: "1. Choose which type of comments to export.",
    export_step2: "2. Choose whether to include archived caches.",
    export_step3: "3. Choose the target format:",
    export_explain:
        "By pressing the 'Perform filtered Export' button, your caches will be filtered and the output will be generated. You will be asked to save a cryptically named file. Just store it where you like and rename it appropriately, e.g., 'myfinds2012.html'.\n\nYou can also export to Dropbox. You will be asked for a file name that will be created in your Dropbox folder.",
    export_perform: "Perform filtered export",
    export_toServer: "Export all to server",
    export_toDropbox: "Export all to Dropbox",
    export_toDropboxEnterFileName: "Please enter the file name",
    export_toDropboxPerformFilteredExport: "Perform filtered export to Dropbox",
    export_toGistPerformFilteredExport:
        "Perform filtered export as shareable link",
    export_toServer_result: "The server said",
    import_explain:
        "You can import backups that were previously exported using GCComment. The only file formatted supported right now is GCC, i.e., GCComments own file format. After pressing the 'Execute Import' button, the import will be parsed. Comments will be imported, unless there is already a comment with a newer time stamp. So more recent comments cannot be overwritten by older backups.",
    import_choose: "Choose GCC file to import from (*.gcc):",
    import_fromServer: "Load from server",
    import_fromDropbox: "Load from Dropbox",
    import_fromGist: "Load from link",
    import_fromDropboxCheckForFiles: "Check on Dropbox",
    import_perform: "Execute import",
    import_close: "Close import window",
    import_resultimported: "Imported comments",
    import_resultnotimported: "Already existing",
    delete_select: "Select the types you want to delete:",
    all: "all",
    delete_perform: "Perform delete all",
    delete_result: "Removed caches",
    delete_confirmation:
        "Do you really want to delete comments according to your filters?\n\nIf you press ok, all comments according to the selected filters will be removed! Make sure to have a backup! All removed comments will be written to the error console.",
    delete_confirmation_overview: "Do you really want to delete this comment?",
    patchgpx_explain:
        "You can open an existing GPX file and patch it according to the options selected below. By pressing 'Patch and Download', the GPX file will be loaded and you will be asked to save a file with a strange filename. Save it and rename the file to something useful, e.g., 'onlysolved.gpx'.",
    patchgpx_remove: "Remove caches from GPX that ...",
    patchgpx_filter_nogcc: "have no GCC entry",
    patchgpx_filter_markeddefaulttype: "you marked with default state",
    patchgpx_filter_markednotsolved: "you marked as not solved",
    patchgpx_filter_markedsolved: "you marked as solved",
    patchgpx_filter_markfound: "you marked as found",
    patchgpx_changeorig:
        "Change the original waypoint's coordinates to your final coordinates",
    patchgpx_addwptforfinal: "Add additional waypoints for final coordinates",
    patchgpx_stripemojis:
        "Remove emojis if present (warning: beta state. if your emoji was not removed, please send the GPX to ramirez_@online.de)",
    patchgpx_striphtmltags: "Remove HTML tags from descriptions",
    patchgpx_perform: "Patch and download",
    detail_final: "Final coordinate",
    detail_finalsave: "Save final coordinate",
    detail_finaldelete: "Delete final coordinate",
    detail_lastsaved: "last saved",
    detail_edit: "Edit comment",
    detail_share: "Share comment",
    detail_delete: "Delete comment",
    detail_thestate: "State",
    detail_save: "Save comment",
    detail_cancel: "Cancel editing",
    detail_add: "Add comment",
    detail_finaldeleteconfirmation:
        "Do you really want to delete the final coordinates?",
    detail_deleteconfirmation: "Do you really want to delete this comment?",
    detail_inclfinal: "incl. final",
    detail_jumptocomment: "Jump to Comment",
    map_enablemm: "Enable mystery mover and show ...",
    map_area: "161m area",
    map_home: "link to original",
    map_notusingleaflet:
        "GCComment mystery mover only works on the standard (leaflet-based) map of Geocaching.com!",
    map_includewpt: "Include waypoints",
    log_markfound: "Mark as found in GCC",
    log_movearchive: "Move to archive in GCC",
    alert_couldnotparse:
        "Coordinates could not be parsed. Please correct them before saving.\nError Message:",
    alert_coordsnotvalid: "Coordinates do not match DegMin, Dec, or Plain",
    gpxexporttitle: "Waypoint listing with final coordinates of geocaches",
    gpxexportdesc: "This is an export of ",
    gpxexportwpttitle: "GCComment Final and Comment",
    kmlexporttitle: "Waypoint listing with final coordinates of geocaches",
    actionfailed: "Action failed",
    savegpx_explain: "Use GCComment information to configure your GPX ",
    savegpx_addgcc: "Add your GCComment",
    savegpx_changeorig:
        "Change the original coordinates to your final coordinates",
    savegpx_addfinal: "Add final coordinates as separate waypoint",
    update_changes: "Changes in version ",
    update_clickToUpdate: "Click here to update!",
    tmpl_commentremoved:
        "Removed <a target='blank' href='data:text/html;base64,{{1}}' class='gcccomment' data-gcccom='{{2}}'>comment.</a>",
    tmpl_patchresult:
        "Patching removed {{countWPTRemoved}} waypoints.<br/>Patching added {{countWPTAdded}} waypoints.<br/>Patching changed Coords of {{countCoordChanged}} waypoints.<br/>The GPX now contains {{total}} waypoints.",
    tmpl_import_replace:
        "Replacing the <a target='blank' href='data:text/html;base64,{{oldTooltipBase64}}' class='gcccomment' data-gcccom='{{oldTooltip}}'>old comment</a> with a <a target='blank' href='data:text/html;base64,{{importTooltipBase64}}' class='gcccomment' data-gcccom='{{importTooltip}}'>new comment</a>.",
    tmpl_import_save:
        "Saving <a target='blank' href='data:text/html;base64,{{importTooltipBase64}}' class='gcccomment' data-gcccom='{{importTooltip}}'>new comment.</a></li>",
    tmpl_update:
        "Hooray, a GCComment update is available. The new version is {{serverVersion}} while your installed version is {{version}}.",
    editWaypoint: "Edit waypoint",
    removeWaypoint: "Remove waypoint",
    addWaypoint: "Add waypoint",
    waypoints: "Waypoints",
    archived_filter_no_archived: "no archived",
    archived_filter_include_archived: "include archived",
    archived_filter_only_archived: "only archived",
    shareImportNew: "A site wants to import a new comment:\n%name%\nAllow?",
    shareImportOverride:
        "A site wants to override one of your comments:\n%name%\nAllow?",
    gistNotice:
        "If you share comments as links GCComment will uploaded them as secret anonymous gists (they are not public, but also not deleteable)",
    gistNoticeMoreInfo: "[More info]",
    gistNoticeHide: "[Do not show again]",
    gistNoticeLink:
        "https://github.com/lukeIam/gcc/wiki/ShareLinksGerman#mehr-informationen-zum-teilen-von-kommentaren-als-links"
};
_languages[SETTINGS_LANGUAGE_DE] = {
    mycomments: "Meine Kommentare",
    mycomment: "Mein Kommentar",
    myfinalcoords: "Meine Finalkoordinaten",
    and: "und",
    both: "beide",
    nothing: "nichts",
    archived: "archiviert",
    not_archived: "nicht archiviert",
    never: "niemals",
    download: "Download",
    finale: "Finale",
    final_coordinate: "Finalkoordinate",
    final_location: "Finalort",
    final_location_byGCC: "Finalort von GCC",
    menu_options: "Optionen anzeigen",
    menu_showmycomments: "Zeige meine Kommentare",
    menu_export: "Export",
    menu_import: "Import",
    menu_delete: "Löschen",
    menu_patchgpx: "GPX patchen",
    type_untyped: "ungetypt",
    type_unsolved: "ungelöst",
    type_solved: "gelöst",
    type_found: "gefunden",
    type_archived: "archiviert",
    ov_totalamount: "Gesamtanzahl",
    ov_amountarchive: "Anzahl derer im Archiv",
    ov_lastex: "Letzter Export",
    ov_lastim: "Letzter Import",
    ov_lastup: "Letzte Prüfung auf Aktualisierung",
    settings_intro:
        "Vielen Dank für die Verwendung von GCComment. Besuche <a href='https://github.com/Birnbaum2001/GCComment' target='blank'>github.com</a> für allgemeine Informationen und Dokumentation oder <a href='http://www.geoclub.de/viewtopic.php?f=117&t=44631' target='blank'>geoclub.de</a> für Diskussionen und Rückmeldungen. Wenn du direkte Rückmeldungen oder Fragen hast, dann kannst du uns über <a href='mailto:ramirez_@online.de'>ramirez_@online.de</a> oder <a href='mailto:birnbaum2001@gmx.de'>birnbaum2001@gmx.de</a> kontaktieren.",
    settings_feelfree:
        "Zögere nicht, deiner Wertschätzung Ausdruck zu verleihen :)",
    settings_enterUUID: "UUID zur Serversynchronisierung",
    settings_enterServer: "Server zur Serversynchronisierung",
    settings_allowExport:
        "Erlaube den Export der Kommentare an andere Skripte (z.B. GC Tour)",
    settings_lazyTable:
        "Träge Tabellenaktualisierung (Keine Aktualisierung der Übersichtstabelle nach Statusänderung oder Löschen)",
    settings_syncWithGS:
        "Korrigiere die Finalkoordinaten bei Groundspeak beim Speichern",
    settings_saveCacheNotes:
        "Lade alle Kommentare beim Speichern als Cache Note hoch",
    settings_saveprefs: "Einstellungen speichern",
    settings_language: "Language / Sprache",
    thank_you: "Danke",
    table_comments: "Mein Kommentare & Finalkoordinaten",
    table_lastsave: "Letztes Speichern",
    table_actions: "Aktionen",
    table_ihaveit: "Ich habe die Finalkoordinate :)",
    table_isarchived: "Dieser Cache ist archiviert",
    table_fromhome: "von zuhause",
    table_markcacheas: "Markiere Cache als",
    table_editondetail: "Auf Detailseite editieren",
    table_removefromarchive: "Aus dem Archiv entfernen",
    table_addtoarchive: "In das Archiv einfügen",
    table_finalat: "Finale bei ",
    table_filter_all: "Zeige alle",
    table_filter_untyped: "Zeige alle ungetypten",
    table_filter_unsolved: "Zeige alle ungelösten",
    table_filter_solved: "Zeige alle gelösten",
    table_filter_found: "Zeige alle gefundenen",
    table_filter_archived: "Zeige alle archivierten",
    table_filtered_by: "Gefiltert nach",
    export_step1: "1. Wähle den Typ der zu exportierenden Kommentare.",
    export_step2: "2. Wähle den gewünschten Archivstatus.",
    export_step3: "3. Wähle das Zielformat:",
    export_explain:
        "Durch drücken des 'Gefilterten Export durchführen'-Knopf werden die Kommentare gemäß der Einstellungen gefiltert und das gewählte Ausgabeformat erzeugt. Es wird eine Datei mit einem kryptischen Namen gespeichert. Diese einfach irgendwo ablegen und entsprechend umbenennen z.B. 'MeineFunde_2012.html'.\n\nBeim Export zur Dropbox wird nach einem Dateinamen gefragt, welche in der Dropbox erstellt werden soll.",
    export_perform: "Gefilterten Export durchführen",
    export_toServer: "Alle zum Server exportieren",
    export_toDropbox: "Alle zur Dropbox exportieren",
    export_toDropboxEnterFileName: "Bitte Dateinamen eingeben",
    export_toDropboxPerformFilteredExport:
        "Gefilterten Export zu Dropbox durchführen",
    export_toGistPerformFilteredExport: "Gefilterter Export als teilbarer Link",
    export_toServer_result: "Der Server sagte",
    import_explain:
        "Es können Sicherungskopien importiert werden, die zuvor von GCComment exportiert wurden. Es wird nur das GCComment-eigene Dateiformat unterstützt (*.gcc). Nach dem Drücken des 'Import durchführen'-Knopf wird der Import geprüft. Die Kommentare werden importiert solange nicht schon ein Kommentar mit einem neueren Zeitstempel vorhanden ist. Daher können aktuellere Kommentare nicht durch ältere überschrieben werden.",
    import_choose: "Wähle GCC-Datei zum Importieren (*.gcc):",
    import_fromServer: "Lade vom Server",
    import_fromDropbox: "Lade von Dropbox",
    import_fromGist: "Lade von Link",
    import_fromDropboxCheckForFiles: "Prüfe in Dropbox",
    import_perform: "Import durchführen",
    import_close: "Importfenster schließen",
    import_resultimported: "Importierte Kommentare",
    import_resultnotimported: "Bereits existierende Kommentare",
    delete_select: "Wähle die zu löschenden Kommentartypen:",
    all: "alle",
    delete_perform: "Alle löschen",
    delete_result: "Gelöschte Kommentare",
    delete_confirmation:
        "Möchtest du wirklich die Kommentare gemäß der Filtereinstellungen löschen?\n\nWenn du Ok drückst, werden diese gelöscht! Stelle sicher, dass du ein Backup hast. Zur Sicherheit werden alle gelöschten Kommentare auf die Fehlerkonsole (CTRL-Shift-J) geschrieben.",
    delete_confirmation_overview:
        "Möchtest du diesen Kommentar wirklich löschen?",
    patchgpx_explain:
        "Du kannst eine existierende GPX-Datei öffnen und entsprechend der folgenden Optionen patchen. Durch klicken von 'Patch und Download' wird die GPX-Datei geladen und du wirst gebeten, eine Datei mit seltsamem Dateinamen abzuspeichern. Tu dies und benenne die Datei in etwas Sinnvolles um, z.B. 'nur_gelöste.gpx'.",
    patchgpx_remove: "Entferne Caches aus dem GPX, die ...",
    patchgpx_filter_nogcc: "keinen GCComment-Eintrag haben",
    patchgpx_filter_markeddefaulttype: "als default markiert sind",
    patchgpx_filter_markednotsolved: "als ungelöst markiert sind",
    patchgpx_filter_markedsolved: "als gelöst markiert sind",
    patchgpx_filter_markfound: "als gefunden markiert sind",
    patchgpx_changeorig:
        "Ändere die Koordinaten des Original-Wegpunktes auf deine Finalkoordinaten",
    patchgpx_addwptforfinal:
        "Füge einen zusätzlichen Wegpunkt für deine Finalkoordinaten ein",
    patchgpx_stripemojis:
        "Entferne Emojis falls vorhanden (Warning: Betastatus. Wenn ein Emoji nicht entfernt wurde, bitte das GPX an birnbaum2001@gmx.de senden)",
    patchgpx_striphtmltags: "Entferne HTML tags aus den Beschreibungen",
    patchgpx_perform: "Patchen und herunterladen",
    detail_final: "Finalkoordinate",
    detail_finalsave: "Finalkoordinate speichern",
    detail_finaldelete: "Finalkoordinate löschen",
    detail_lastsaved: "zuletzt gespeichert",
    detail_edit: "Kommentar editieren",
    detail_share: "Kommentar teilen",
    detail_delete: "Kommentar löschen",
    detail_thestate: "Kommentarstatus",
    detail_save: "Kommentar speichern",
    detail_cancel: "Editieren abbrechen",
    detail_add: "Kommentar hinzufügen",
    detail_finaldeleteconfirmation:
        "Möchtest du wirklich die Finalkoordinate löschen?",
    detail_deleteconfirmation: "Möchtest du wirklich diesen Kommentar löschen?",
    detail_inclfinal: "inkl. Finale",
    detail_jumptocomment: "springe zum Kommentar",
    map_enablemm: "Aktiviere den Mystery-Verschieber und zeige ...",
    map_area: "161m-Radius",
    map_home: "Verbindung zum Original",
    map_notusingleaflet:
        "Der GCComment Mystery-Verschieber funktioniert nur auf der Standardkarte (leaflet) von Geocaching.com!",
    map_includewpt: "Wegpunkte einbeziehen",
    log_markfound: "In GCC als gefunden markieren",
    log_movearchive: "In GCC ins Archiv bewegen",
    alert_couldnotparse:
        "Koordinaten konnten nicht geparst werden. Bitte vor dem Speichern korrigieren:\nFehlermeldung:",
    alert_coordsnotvalid: "Koordinaten sind nicht DegMin, Dec, or Plain",
    gpxexporttitle: "Wegpunkte mit Finalkoordinaten von Geocaches",
    gpxexportdesc: "Das ist ein Export von ",
    gpxexportwpttitle: "GCComment Finale und Kommentar",
    kmlexporttitle: "Wegpunkte mit Finalkoordinaten von Geocaches",
    actionfailed: "Aktion fehlgeschlagen",
    savegpx_explain:
        "Benutze GCComment-Information, um das GPX zu konfigurieren ",
    savegpx_addgcc: "Füge deinen Kommentar hinzu",
    savegpx_changeorig:
        "Ändere die Originalkoordinate auf deine Finalkoordinate",
    savegpx_addfinal:
        "Füge die Finalkoordinate als zusätzlichen Wegpunkt hinzu",
    update_changes: "Änderungen in Version ",
    update_clickToUpdate: "Hier klicken, um das Update einzuspielen!",
    tmpl_commentremoved:
        "<a target='blank' href='data:text/html;base64,{{1}}' class='gcccomment' data-gcccom='{{2}}'>Kommentar</a> gelöscht.",
    tmpl_patchresult:
        "Patching hat {{countWPTRemoved}} Wegpunkte entfernt.<br/>Patching hat {{countWPTAdded}} Wegpunkte hinzugefügt.<br/>Patching hat {{countCoordChanged}} Koordinaten von Wegpunkten geändert.<br/>Die GPX-Datei enthält nun {{total}} Wegpunkte.",
    tmpl_import_replace:
        "Der <a target='blank' href='data:text/html;base64,{{oldTooltipBase64}}' class='gcccomment' data-gcccom='{{oldTooltip}}'>alte Kommentar</a> wurde durch den <a target='blank' href='data:text/html;base64,{{importTooltipBase64}}' class='gcccomment' data-gcccom='{{importTooltip}}'>neuen Kommentar</a> ersetzt.",
    tmpl_import_save:
        "Ein <a target='blank' href='data:text/html;base64,{{importTooltipBase64}}' class='gcccomment' data-gcccom='{{importTooltip}}'>neuer Kommentar</a> wurde gespeichert.</li>",
    tmpl_update:
        "Hooray, eine Aktualisierung für GCComment ist verfügbar. Die neue Version ist {{serverVersion}}, während die installierte Version {{version}} ist.",
    editWaypoint: "Wegpunkt bearbeiten",
    removeWaypoint: "Wegpunkt entfernen",
    addWaypoint: "Wegpunkt hinzufügen",
    waypoints: "Wegpunkte",
    archived_filter_no_archived: "keine archivierten",
    archived_filter_include_archived: "archivierte einschließen",
    archived_filter_only_archived: "nur archivierte",
    shareImportNew:
        "Eine Seite möchte einen neuen Kommentar importieren:\n%name%\nErlauben?",
    shareImportOverride:
        "Eine Seite möchte einen deiner Kommentare überschreiben:\n%name%\nErlauben?",
    gistNotice:
        "Wenn Kommentare als Link geteilt werden, läd GCComment diese als geheime und anonyme Gists hoch (diese sind nicht öffentlich, können aber auch nicht gelöscht werden)",
    gistNoticeMoreInfo: "[Mehr Informationen]",
    gistNoticeHide: "[Zeige diesen Hinweis nicht mehr]",
    gistNoticeLink:
        "https://github.com/lukeIam/gcc/wiki/ShareLinksGerman#mehr-informationen-zum-teilen-von-kommentaren-als-links"
};

export const languages = _languages;

var getLanguage = () => {
    var langsetting = GCC_getValue(SETTINGS_LANGUAGE);

    if (langsetting === SETTINGS_LANGUAGE_AUTO) {
        if ($(".selected-language > a:first")) {
            var gslang = $(".selected-language > a:first").text();
            if (gslang.indexOf("English") > -1)
                return languages[SETTINGS_LANGUAGE_EN];
            else if (gslang.indexOf("Deutsch") > -1)
                return languages[SETTINGS_LANGUAGE_DE];
        }
    } else if (languages[langsetting]) {
        return languages[langsetting];
    }

    return languages[SETTINGS_LANGUAGE_EN];
};

export const lang = getLanguage();
