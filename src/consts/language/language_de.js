import { Language } from "./languageClass.js";

export const language_de = new Language({
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
        "Vielen Dank für die Verwendung von GCComment. Besuche <a href='https://github.com/GCComment/GCComment2' target='blank'>github.com</a> für allgemeine Informationen und Fehlerberichte oder <a href='http://www.geoclub.de/viewtopic.php?f=117&t=44631' target='blank'>geoclub.de</a> für Diskussionen und allgemeine Fragen.",
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
    export_explain:
        "Durch drücken des 'Gefilterten Export durchführen'-Knopf werden die Kommentare gemäß der Einstellungen gefiltert und das Ergebnis heruntergeladen.",
    export_perform: "Gefilterten Export durchführen",
    export_toDdrive: "Alle zur GoogleDrive exportieren",
    import_explain:
        "Es können Sicherungskopien importiert werden, die zuvor von GCComment exportiert wurden. Es wird nur das GCComment-eigene Dateiformat unterstützt (*.gcc). Nach dem Drücken des 'Import durchführen'-Knopf wird der Import geprüft. Die Kommentare werden importiert solange nicht schon ein Kommentar mit einem neueren Zeitstempel vorhanden ist. Daher können aktuellere Kommentare nicht durch ältere überschrieben werden.",
    import_choose:
        "Ziehe ein Backupfile (*.json or *.gcc) hierhin oder klicke hier:",
    import_fromDrive: "Importiere ausgewählte Datei von Google Drive",
    import_updateDriveList: "Lade Liste von Google Drive",
    import_perform: "Import durchführen",
    import_close: "Leere Import",
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
});
