const Discord = require("discord.js");
const jsl = require("svjsl");
const settings = require("../settings");

jsl.unused(Discord);

const meta = {
    name: "Initialize",
    description: `Starts an interactive prompt that sets ${settings.name} up for your server`,
    category: "Moderation",
    permissions: [
        {
            scope: "guild",
            id: "MANAGE_SERVER"
        }
    ],
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
    message.channel.send(`Work In Progress`);
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
