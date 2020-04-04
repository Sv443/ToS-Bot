const Discord = require("discord.js");
const logger = require("../src/logger");
const jsl = require("svjsl");
const settings = require("../settings");

jsl.unused(Discord, settings);

const meta = {
    name: "Configure",
    description: `Used to configure bot settings individually for your Discord server. Use the command \`configure help\` for more info.`,
    category: "Moderation",
    permissions: [
        {
            scope: "guild",
            id: "MANAGE_GUILD"
        }
    ],
    arguments: [
        {
            name: "setting",
            description: `The setting you want to change`,
            optional: false
        },
        {
            name: "value",
            description: `The value you want to change this setting to`,
            optional: false
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
    jsl.unused(client, message);
    try
    {
        message.channel.send(`Work In Progress!`);
    }
    catch(err)
    {
        logger("Cmd", meta.name, `General Error: ${err} - Args: ${args.join(", ")}`);
    }
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
