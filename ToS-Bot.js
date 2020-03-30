const wrap = require("node-wrap");
const fs = require("fs");
const resolve = require("path").resolve;
const jsl = require("svjsl");
const settings = require("./settings");


const wrapFilePath = "./src/main";


settings.createDirs.forEach(dir => {
    dir = resolve(dir);
    if(!fs.existsSync(dir))
        fs.mkdirSync(dir);
});

if(jsl.inDebugger())
    require(wrapFilePath);
else
{
    wrap(wrapFilePath, {
        bootLoopDetection: 4000,
        logFile: settings.logs.wrapperLogFilePath,
        logTimestamp: true,
        restartOnCrash: true
    });
}
