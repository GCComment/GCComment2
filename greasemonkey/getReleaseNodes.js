const https = require("https");

const urlChangeLog =
    "https://raw.githubusercontent.com/GCComment/MaintenanceFiles/main/version.json";

const handleChangelog = (changeLog) => {
    const currentVersion = changeLog["latestVersion"];
    for (var change of changeLog["changes"]) {
        if (change["version"] == currentVersion) {
            const releaseMessage = change["change"].join("\n");
            console.log(releaseMessage);
            break;
        }
    }
};

https.get(urlChangeLog, (resp) => {
    var result = "";
    resp.on("data", (chunk) => {
        result += chunk;
    });
    resp.on("end", () => {
        try {
            const changeLog = JSON.parse(result);
            handleChangelog(changeLog);
        } catch (e) {}
    });
});
