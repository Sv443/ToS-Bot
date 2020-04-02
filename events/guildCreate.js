const Discord = require("discord.js");
const jsl = require("svjsl");
jsl.unused(Discord);

const settings = require("../settings");
const firstJoin = require("../src/firstJoin");

const meta = {
    name: "Join Server",
    description: `Fires off every time ${settings.name} joins a server`
}

/**
 * Is run when this event gets triggered
 * @param {Discord.Client} client 
 * @param {Array<*>} args 
 */
function run(client, args)
{
    let guild = args[0];
    firstJoin(client, guild);
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
