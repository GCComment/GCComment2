import { lang } from "../consts/language/language";

// converts a long time stamp to a readable time string
export const createTimeString = (time, simple) => {
    if (time === null || time < 0) {
        return lang.never;
    } else {
        var lastSave = null;
        if (typeof time === "object") lastSave = time;
        else lastSave = new Date(parseInt(time));
        // lastSave.setTime(time);
        var month = lastSave.getMonth() + 1;
        var day = lastSave.getDate();
        var hour = lastSave.getHours();
        var minute = lastSave.getMinutes();
        var sec = lastSave.getSeconds();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        if (hour < 10) hour = "0" + hour;
        if (minute < 10) minute = "0" + minute;
        if (sec < 10) sec = "0" + sec;

        if (simple) {
            return `${lastSave.getFullYear()}-${month}-${day}`;
        } else {
            return `${lastSave.getFullYear()}-${month}-${day} ${hour}:${minute}:${sec}`;
        }
    }
};
