const Discord = require("discord.js");
const jsl = require("svjsl");
jsl.unused(Discord);

const settings = require("../settings");
const guildSettings = require("../src/guildSettings");

const meta = {
    name: "Member Left",
    description: `Fires off every time someone leaves a guild ${settings.name} is part of`
}

/**
 * Is run when this event gets triggered
 * @param {Discord.Client} client 
 * @param {Array<*>} args 
 */
function run(client, args)
{
    jsl.unused(client);
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
