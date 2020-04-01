const { resolve } = require("path");
const package = require("./package.json");

const settings = {
    name: "ToS-Bot",
    version: package.version.split(".").map(x=>x=parseInt(x)),
    supportServerID: "565933531214118942",
    enableDblApi: false,
    bot: {
        clientID: "692862284212600833",
        permissionInteger: 1565518966,
        developerIDs: [
            "415597358752071693"
        ],
        defaultPrefix: "tos"
    },
    commands: {
        folder: resolve("./commands"),
        rm: {
            maxAmount: 100
        }
    },
    events: {
        folder: resolve("./events")
    },
    logs: {
        wrapperLogFilePath: resolve("./logs/wrapper.log")
    },
    createDirs: [
        "./logs"
    ],
    messages: {
        defaultEmbedColor: "#6472b7"
    }
};

module.exports = Object.freeze(settings);

// invite URL https://discordapp.com/oauth2/authorize?client_id=692862284212600833&scope=bot&permissions=1565518966
