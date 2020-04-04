const Discord = require("discord.js");
const jsl = require("svjsl");

const settings = require("../settings");

jsl.unused(Discord, settings);


/**
 * Is run when this event gets triggered
 * @param {Discord.Client} client 
 * @param {Discord.Guild} args 
 */
function firstJoin(client, guild)
{
    jsl.unused(client, guild);
    // TODO: all of this
}

module.exports = firstJoin;
