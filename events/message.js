const Discord = require("discord.js");
const jsl = require("svjsl");
jsl.unused(Discord);

const settings = require("../settings");
const guildSettings = require("../src/guildSettings");
const checkBadMessage = require("../src/checkBadMessage");

const meta = {
    name: "Received Message",
    description: `Fires off every time ${settings.name} receives a message`
}

/**
 * Is run when this event gets triggered
 * @param {Discord.Client} client 
 * @param {Array<*>} args 
 */
function run(client, args)
{
    jsl.unused(client);
    
    let message = args[0];
    
    guildSettings.get(message.guild, "CheckBadMsgs").then(badMsgs => {
        if(badMsgs == 1)
            checkBadMessage(message);
    });
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
