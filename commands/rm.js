const Discord = require("discord.js");
const logger = require("../src/logger");
const jsl = require("svjsl");
const settings = require("../settings");
const isDeveloper = require("../src/isDeveloper");

jsl.unused(Discord);

const meta = {
    name: "Remove",
    description: `Removes the last x messages from the chat`,
    category: "Moderation",
    permissions: [
        "MANAGE_MESSAGES"
    ],
    arguments: [
        {
            name: "amount_of_messages",
            description: `The amount of messages you want to remove`,
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
    jsl.unused(client);
    try
    {
        let amount = parseInt(args[0]);

        if(isNaN(amount) || amount < 1 || amount > settings.commands.rm.maxAmount)
            message.reply(`The first argument of the command should be a number larger than or equal to 1, and smaller than or equal to ${settings.commands.rm.maxAmount}`);

        if(message.member.hasPermission("MANAGE_MESSAGES") || isDeveloper(message.author.id))
            message.channel.bulkDelete(amount + 1).catch(err => message.reply(`Error while bulk deleting messages: ${err}`));
        else message.reply(`I am missing the permission to manage messages. Please contact the administrator(s) of this server.`);
    }
    catch(err)
    {
        logger("Cmd", meta.name, `General Error: ${err} - Args: ${args.join(", ")}`);
    }
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
