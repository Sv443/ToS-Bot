const jsl = require("svjsl");
const settings = require("../settings");

const meta = {
    name: "Join Server",
    description: `Fires off every time ${settings.name} joins a server`
}

function run(client, args)
{
    
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
