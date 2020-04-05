const Discord = require("discord.js");
const logger = require("../src/logger");
const jsl = require("svjsl");
const settings = require("../settings");

jsl.unused(Discord, settings);

const meta = {
    name: "Ping",
    description: `Used to check if the bot is online and responds to commands`,
    category: "Other",
    permissions: [],
    arguments: [],
    devOnly: false
};


/**
 * Runs this command
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 */
function run(client, message, args)
{
    jsl.unused(client, args);
    try
    {
        message.react("🏓").catch(err => logger("Cmd", meta.name, `Error while reacting on message: ${err}`));
    }
    catch(err)
    {
        logger("Cmd", meta.name, `General Error: ${err}`);
    }
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
