const Discord = require("discord.js");
const jsl = require("svjsl");

const settings = require("../settings");
const resolveUser = require("../src/resolveUser");
const resolveTime = require("../src/resolveTime");

jsl.unused(Discord);

const meta = {
    name: "Mute",
    description: `Mutes a user for a specified amount of time`,
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
            description: "The user that should be muted",
            optional: false
        },
        {
            name: "Time",
            description: "For how long the user should be muted",
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
    let time = resolveTime(args[1]);

    // TODO:
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
