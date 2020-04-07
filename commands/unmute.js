const Discord = require("discord.js");
const jsl = require("svjsl");

const settings = require("../settings");
const resolveUser = require("../src/resolveUser");
const resolveTime = require("../src/resolveTime");

jsl.unused(Discord);

const meta = {
    name: "Unmute",
    description: `Unmutes a user who has previously been muted with the \`mute\` command`,
    category: "Moderation",
    permissions: [
        {
            scope: "guild",
            id: "MUTE_MEMBERS"
        }
    ],
    arguments: [
        {
            name: "User",
            description: "The user you want to unmute",
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
    let user = resolveUser(args[0], message.guild);

    // TODO:
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
