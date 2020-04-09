const Discord = require("discord.js");
const logger = require("../src/logger");
const jsl = require("svjsl");
const settings = require("../settings");

jsl.unused(Discord);

const meta = {
    name: "Say",
    description: `Makes ${settings.name} repeat some text after you`,
    category: "Moderation",
    permissions: [
        {
            scope: "guild",
            id: "BAN_MEMBERS"
        }
    ],
    arguments: [
        {
            name: "channel",
            description: `The channel you want the message sent in - leave empty to use the current channel - expected format: #channel`,
            optional: true
        },
        {
            name: "text",
            description: `The text you want ${settings.name} to say`,
            optional: false
        }
    ],
    devOnly: false
};


/**
 * Runs this command
 * @param {discord.Client} client 
 * @param {discord.Message} message 
 * @param {Array<String>} args 
 */
function run(client, message, args)
{
    jsl.unused(client);
    try
    {
        if(message.deletable)
            message.delete().then(() => {
                let chn = message.channel;

                try
                {
                    if(args[0].match(/<#[0-9]{18}>/))
                        chn = message.guild.channels.cache.find(ch => ch.id === args[0].substring(2, 20));
                    
                    args.shift();

                    chn.send(args.join(" ")).catch(err => {
                        message.reply(`Error: ${err}`);
                    });
                }
                catch(err)
                {
                    message.reply(`there was an error while trying to send your message in ${`<#${chn.id}>` || "(unknown channel)"}>: ${err}`);
                }
            });
        else message.reply(`I am missing the permission to manage messages or send messages. Please contact the administrator(s) of this server.`)/*.catch(() => {})*/;
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
        logger("Cmd", meta.name, `General Error: ${err} - Args: ${args.join(", ")}`);
    }
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
