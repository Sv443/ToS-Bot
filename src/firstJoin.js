const Discord = require("discord.js");
const jsl = require("svjsl");
jsl.unused(Discord);

const settings = require("../settings");

/**
 * Is run when this event gets triggered
 * @param {Discord.Client} client 
 * @param {Discord.Guild} args 
 */
function firstJoin(client, guild)
{

}

module.exports = firstJoin;
