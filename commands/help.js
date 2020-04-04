const Discord = require("discord.js");
const logger = require("../src/logger");
const jsl = require("svjsl");
const settings = require("../settings");

jsl.unused(Discord, settings);

const meta = {
    name: "Help",
    description: `Displays all of ${settings.name}'${settings.name.endsWith("s") ? "" : "s"} commands`,
    category: "Other",
    permissions: [],
    arguments: [
        {
            name: "command",
            description: `The command you want to see detailed help on (optional)`,
            optional: true
        }
    ],
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
        message.channel.send(`Work In Progress!`);
    }
    catch(err)
    {
        logger("Cmd", meta.name, `General Error: ${err}`);
    }
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
