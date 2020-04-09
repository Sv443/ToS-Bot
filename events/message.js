const Discord = require("discord.js");
const jsl = require("svjsl");
jsl.unused(Discord);

const settings = require("../settings");
const sql = require("../src/sql");
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
    let guild = message.guild;
    let user = message.author;
    
    guildSettings.get(guild, "CheckBadMsgs").then(badMsgs => {
        if(badMsgs == 1)
            checkBadMessage(message);
    });

    sql.sendQuery(`SELECT * FROM \`${settings.commands.mute.dbTableName}\` WHERE UserID = ?`, user.id).then(res => {
        if(res.length > 0)
        {
            res.forEach(entry => {
                if(entry["GuildID"] == guild.id)
                {
                    return message.delete().catch(err => {
                        guildSettings.get(guild, "LogChannelID").then(logChannel => {
                            if(logChannel)
                                guild.channels.cache.find(ch => ch.id === logChannel).send(`Error while deleting message of muted user ${user}: ${err}`)/*.catch(() => {})*/;
                        })/*.catch(() => {})*/;
                    });
                }
            });
        }
    })/*.catch(() => {})*/
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
