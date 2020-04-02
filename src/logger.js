const jsl = require("svjsl");
const fs = require("fs");
const path = require("path");
const settings = require("../settings");

jsl.unused(fs, path, settings);


function logger(section, subSection, message)
{
    let logContent = `[${getDateTime()} - ${section}/${subSection}] ${message}`;
    console.log(logContent);

    fs.appendFileSync(settings.logs.logFilePath, `${logContent}\n`);
}

function getDateTime()
{
    let d = new Date();

    let dt = {
        y: d.getFullYear(),
        m: d.getMonth(),
        d: d.getDay(),
        hr: d.getHours(),
        mn: d.getMinutes(),
        sc: d.getSeconds()
    };

    return `${dt.y}/${dt.m < 10 ? "0" : ""}${dt.m}/${dt.d < 10 ? "0" : ""}${dt.d} | ${dt.hr < 10 ? "0" : ""}${dt.hr}:${dt.mn < 10 ? "0" : ""}${dt.mn}:${dt.sc < 10 ? "0" : ""}${dt.sc}`;
}

module.exports = logger;
