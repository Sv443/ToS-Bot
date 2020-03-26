const { resolve, join } = require("path");
const package = require("./package.json");

const settings = {
    name: "ToS-Bot",
    version: package.version.split(".").map(x=>x=parseInt(x)),
    supportServerID: "565933531214118942",
    bot: {
        clientID: "692862284212600833",
        permissionInteger: 1565518966,
        developerIDs: [
            "415597358752071693"
        ]
    },
    commands: {
        folder: resolve("./commands")
    },
    events: {
        folder: resolve("./events")
    }
};

module.exports = Object.freeze(settings);
