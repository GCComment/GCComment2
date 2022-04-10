import async from "async";
import { CacheComment } from "../dataClasses/cacheComment.js";
import { log } from "../helper/logger.js";
import { GMWindow } from "./../helper/gmWindow";
import { appendScript } from "./../helper/script";

var folderIdBackup = null;
var folderIdCaches = null;
var folderIdShare = null;

var initalized = false;

const initialize = async () => {
    return new Promise((resolve, reject) => {
        if (initalized) {
            resolve();
        } else {
            addScript().then(resolve, reject);
        }
    });
};

const initializeInternal = async () => {
    return new Promise((resolve, reject) => {
        gapi.client
            .init({
                apiKey: "AIzaSyApCK-uIalBwUytV3M_QjGzwhIhMA3aqbw",
                clientId:
                    "677675280125-b3656minoe9t9m87t7ami1k5bclqjq0k.apps.googleusercontent.com",
                discoveryDocs: [
                    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
                ],
                scope: "https://www.googleapis.com/auth/drive.appdata"
            })
            .then(
                () => {
                    const GoogleAuth = gapi.auth2.getAuthInstance();
                    var loggedIn = GoogleAuth.isSignedIn.get();
                    if (loggedIn) {
                        console.log("logged in");
                        initalized = true;
                        getOrCreateFolderStructure().then(resolve, reject);
                    } else {
                        GoogleAuth.signIn({
                            fetch_basic_profile: false,
                            scope: "https://www.googleapis.com/auth/drive.appdata"
                        }).then(
                            () => {
                                loggedIn = gapi.auth2
                                    .getAuthInstance()
                                    .isSignedIn.get();
                                if (loggedIn) {
                                    console.log("logged in 2");
                                    initalized = true;
                                    getOrCreateFolderStructure().then(
                                        resolve,
                                        reject
                                    );
                                    resolve();
                                } else {
                                    log("info", "Login Failed");
                                    reject();
                                }
                            },
                            function (error) {
                                log(
                                    "info",
                                    `Unable to sign in:\n${JSON.stringify(
                                        error,
                                        null,
                                        2
                                    )}`
                                );
                                reject();
                            }
                        );
                    }
                },
                function (error) {
                    log(
                        "info",
                        `Unable to initalize gapi:\n${JSON.stringify(
                            error,
                            null,
                            2
                        )}`
                    );
                }
            );
    });
};

const addScript = async () => {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        GMWindow.googleOnLoadCallback = () => {
            log("debug", "googleOnLoadCallback");
            initializeInternal().then(resolve, reject);
        };
        appendScript("src", "https://accounts.google.com/gsi/client");
        appendScript(
            "src",
            "https://apis.google.com/js/client.js?onload=googleOnLoadCallback"
        );
    });
};

const getDriveFolders = async (folderId = null, name = null) => {
    return new Promise((resolve, reject) => {
        var folders = [];
        var pageToken = null;
        // Using the npm module 'async' not the async keyword
        async.doWhilst(
            function (callback) {
                const query = `mimeType='application/vnd.google-apps.folder' 
                ${folderId !== null ? `and '${folderId}' in parents` : ""}${
                    name !== null ? ` and name='${name}'` : ""
                }`;
                console.log("getDriveFolders: " + query);
                gapi.client.drive.files
                    .list({
                        q: query,
                        fields: "nextPageToken, files(id, name, parents)",
                        spaces: "appDataFolder",
                        pageToken: pageToken
                    })
                    .then((resp) => {
                        // console.log("getDriveFolders:" + JSON.stringify(resp));
                        resp.result.files.forEach((file) => {
                            console.log(
                                "Found folder:",
                                file.name,
                                file.id,
                                file.parents
                            );
                            folders.push({ name: file.name, id: file.id });
                        });
                        pageToken = resp.result.nextPageToken;
                        callback();
                    });
            },
            function () {
                if (!pageToken) {
                    // Hack: doWhilst callback not triggered
                    resolve(folders);
                }
                return !!pageToken;
            },
            function (err) {
                console.log("yxc");
                if (err) {
                    // Handle error
                    log("info", `Error fetching gdrive folders: ${err}`);
                    reject();
                } else {
                    resolve(folders);
                }
            }
        );
    });
};

const createDriveFolder = async (folderName, parentFolderId = null) => {
    const r = await gapi.client.drive.files.create({
        resource: {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents:
                parentFolderId !== null ? [parentFolderId] : ["appDataFolder"]
        },
        fields: "id"
    });
    console.log("new folder created: " + r.result.id);
    return r.result.id;
};

const getOrCreateFolderStructure = async () => {
    const folders = await getDriveFolders();
    console.log(folders);

    // attach id of found folders
    folders.forEach((folder) => {
        switch (folder.name) {
            case "gccBackup":
                folderIdBackup = folder.id;
                console.log("gccBackup: " + folderIdCaches);
                break;
            case "gccCaches":
                folderIdCaches = folder.id;
                console.log("gccCaches: " + folderIdCaches);
                break;
            case "gccShare":
                folderIdShare = folder.id;
                console.log("folderIdShare: " + folderIdShare);
                break;
            default:
                log("debug", "Skipping unkown folder in gdrive.");
                break;
        }
    });
    // create missing folders
    if (folderIdBackup === null) {
        folderIdBackup = await createDriveFolder("gccBackup");
    }
    if (folderIdCaches === null) {
        folderIdCaches = await createDriveFolder("gccCaches");
    }
    if (folderIdShare === null) {
        folderIdShare = await createDriveFolder("gccShare");
    }
};

export const gDriveGetCacheFile = async (/** @type {string} */ gcid) => {
    await initialize();
    const cacheFolderId = await getCacheFolder(gcid, false);
    if (cacheFolderId === null) {
        return null;
    }

    const cacheFileId = await getFileIdbyName(`${gcid}.json`, cacheFolderId);
    const cacheFileContent = await downloadFile(cacheFileId);
    return CacheComment.fromJson(cacheFileContent);
};

const getCacheFolder = async (gcid, createIfNotExists = false) => {
    console.log(folderIdCaches, gcid);
    const folders = await getDriveFolders(folderIdCaches, gcid);
    console.log("folders.length: " + folders.length);
    if (folders.length === 0) {
        if (createIfNotExists) {
            return await createDriveFolder(gcid, folderIdCaches);
        } else {
            return null;
        }
    }

    return folders[0]["id"];
};

/**
 *
 * @param {string} folderId
 * @returns {Promise<{name: string; id: string;}[]>}
 */
const getFilesInFolder = async (folderId) => {
    return new Promise((resolve, reject) => {
        var files = [];

        const query = `mimeType!='application/vnd.google-apps.folder and '${folderId}' in parents`;
        gapi.client.drive.files
            .list({
                q: query,
                fields: "nextPageToken, files(id, name, parents)",
                spaces: "appDataFolder"
            })
            .then((resp) => {
                console.log(
                    "getFileIdbyName: " +
                        JSON.stringify(resp["result"]["files"][0])
                );
                if (
                    resp["result"]["files"] &&
                    resp["result"]["files"].length > 0
                ) {
                    resp.result.files.forEach((file) => {
                        files.push({ name: file.name, id: file.id });
                    });
                    resolve(files);
                } else {
                    reject();
                }
            });
    });
};

const getFileIdbyName = async (fileName, folderId) => {
    return new Promise((resolve, reject) => {
        var folders = [];

        const query = `name='${fileName}' and '${folderId}' in parents`;
        gapi.client.drive.files
            .list({
                q: query,
                fields: "nextPageToken, files(id, name, parents)",
                spaces: "appDataFolder"
            })
            .then((resp) => {
                console.log(
                    "getFileIdbyName: " +
                        JSON.stringify(resp["result"]["files"][0])
                );
                if (
                    resp["result"]["files"] &&
                    resp["result"]["files"].length > 0
                ) {
                    resolve(resp.result.files[0]["id"]);
                } else if (resp && resp["id"]) {
                    resolve(resp["id"]);
                } else {
                    reject();
                }
            });
    });
};

const downloadFile = async (fileId) => {
    return new Promise((resolve, reject) => {
        gapi.client.drive.files
            .get({
                fileId: fileId,
                alt: "media"
            })
            .then(
                function (res) {
                    console.log("downloadFile: " + res.body);
                    resolve(res.body);
                },
                function () {
                    log("info", "Error downloading file");
                    reject();
                }
            );
    });
};

const uploadJsonFile = async (fileName, content, mimeType, folderId) => {
    return new Promise((resolve, reject) => {
        // modified version of https://stackoverflow.com/a/35182924
        const boundary = "-------314159265358979323846";
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var metadata = {
            name: fileName,
            mimeType: mimeType,
            parents: [folderId]
        };

        var multipartRequestBody =
            delimiter +
            "Content-Type: application/json\r\n\r\n" +
            JSON.stringify(metadata) +
            delimiter +
            "Content-Type: " +
            mimeType +
            "\r\n\r\n" +
            content +
            close_delim;

        var request = gapi.client.request({
            path: "/upload/drive/v3/files",
            method: "POST",
            params: { uploadType: "multipart" },
            headers: {
                "Content-Type": 'multipart/related; boundary="' + boundary + '"'
            },
            body: multipartRequestBody
        });

        request.execute((file) => {
            if (file) {
                console.log("uploadJsonFile: " + JSON.stringify(file));
                resolve(file);
            } else {
                reject();
            }
        });
    });
};

export const gDriveUploadCacheFile = async (
    /** @type {CacheComment} */ cache
) => {
    await initialize();
    const cacheFolderId = await getCacheFolder(cache.gccode, true);
    await uploadJsonFile(
        `${cache.gccode}.json`,
        cache.toJson(),
        "application/json",
        cacheFolderId
    );
};

export const gDriveGetBackupFile = async (name = "latest_gcc_backup.json") => {
    await initialize();
    const backupFileId = await getFileIdbyName(name, folderIdBackup);
    const backupJson = await downloadFile(backupFileId);
    return JSON.parse(backupJson);
};

export const gDriveListBackupFile = async () => {
    await initialize();
    const files = await getFilesInFolder(folderIdBackup);

    return files.map((x) => x.name);
};

export const gDriveUploadBackupFile = async (
    /** @type {CacheComment[]} */ cacheList,
    milestone = false
) => {
    await initialize();
    await uploadJsonFile(
        "latest_gcc_backup.json",
        JSON.stringify(cacheList),
        "application/json",
        folderIdBackup
    );
    if (milestone) {
        await uploadJsonFile(
            `${new Date().toISOString()}_gcc_backup.json`,
            JSON.stringify(cacheList),
            "application/json",
            folderIdBackup
        );
    }
};

export const gDriveCreateOrUpdateAttachment = async (
    /** @type {string} */ gcid,
    /** @type {string} */ filename,
    /** @type {Blob} */ blob
) => {
    await initialize();
    // TODO: implement gDriveCreateOrUpdateAttachment
};

export const gDriveDeleteAttachment = async (
    /** @type {string} */ gcid,
    /** @type {string} */ filename
) => {
    await initialize();
    // TODO: implement gDriveDeleteAttachment
};

export const gDriveGetAttachment = async (
    /** @type {string} */ gcid,
    /** @type {string} */ filename
) => {
    await initialize();
    // TODO: implement gDriveGetAttachment
};
