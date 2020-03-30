const jsl = require("svjsl");
const fs = require("fs");
const path = require("path");
const settings = require("../settings");

jsl.unused(fs, path, settings);


function logger(section, subSection, message)
{
    console.log(`[${section}/${subSection}] ${message}`);
}
module.exports = logger;
