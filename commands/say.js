const discord = require("discord.js");
const jsl = require("svjsl");
const settings = require("../settings");

jsl.unused(discord);

const meta = {
    name: "say",
    description: `Makes ${settings.name} repeat some text after you`,
    category: "Moderation",
    permissions: [
        "KICK_MEMBERS"
    ],
    arguments: [
        {
            name: "text",
            description: `The text you want ${settings.name} to say`,
            optional: false
        }
    ]
};


/**
 * Runs this command
 * @param {discord.Client} client 
 * @param {discord.Message} message 
 * @param {Array<String>} args 
 */
function run(client, message, args)
{
    try
    {
        if(message.deletable)
            message.delete().then(() => {
                message.channel.send(args.join(" ")).catch(err => {
                    message.reply(`Error: ${err}`);
                });
            });
    }
    catch(err)
    {
        logger("Run", meta.name, `General Error: ${err} - Args: ${args.join(", ")}`);
    }
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
