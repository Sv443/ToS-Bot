const wrap = require("node-wrap");
const fs = require("fs");
const { hideSync } = require("hidefile");
const resolve = require("path").resolve;
const jsl = require("svjsl");
const settings = require("./settings");


const wrapFilePath = "./src/main";


settings.createDirs.forEach(dir => {
    dir = resolve(dir);
    if(!fs.existsSync(dir))
        fs.mkdirSync(dir);
});

if(!fs.existsSync(".env"))
{
    fs.copyFileSync(".env.template", "env");
    hideSync("env");
    console.log(`\n\n${jsl.colors.fg.yellow}${settings.name} didn't find a ".env" file in the root directory.\nIt has now been created, please open it and follow the instructions included inside.${jsl.colors.rst}\n\n`);
    process.exit(0);
}

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
