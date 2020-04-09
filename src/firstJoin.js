const Discord = require("discord.js");
const jsl = require("svjsl");

const settings = require("../settings");
const sql = require("./sql");

jsl.unused(Discord, settings);

/**
 * Runs the first join procedure for the specified `guild`
 * @param {Discord.Client} client 
 * @param {Discord.Guild} guild 
 * @param {Discord.Channel} [channel]
 */
function firstJoin(client, guild, channel)
{
    jsl.unused(client);
    // TODO: all of this

    let alreadyExistsMsg = `This server already exists in my database. Please use the command \`${settings.bot.defaultPrefix} configure\` instead.`;

    sql.sendQuery(`SELECT * FROM \`${settings.guildSettings.dbTableName}\` WHERE \`GuildID\` = ?`, guild.id).then(res => {
        if(res.length == 0)
        {
            // guild doesn't exist in DB
            sql.sendQuery(`INSERT INTO \`${settings.guildSettings.dbTableName}\` (GuildID) VALUES (?);`, guild.id).then(res => {
                if(res.affectedRows === 1)
                {
                    let joinMsg = `Hello, I am ${settings.name}.\nI have set the settings for this server to their default values.\nTo configure me to your needs, please use the command \`${settings.bot.defaultPrefix} configure\`\nTo see all available commands, use \`${settings.bot.defaultPrefix} help\`\n\nThank you for adding me to this server!`;
        
                    if(!channel)
                    {
                        guild.channels.cache.array().forEach(chn => {
                            if(chn.memberPermissions(guild.members.cache.find(m => m.id == client.user.id).hasPermission("SEND_MESSAGES")))
                                chn.send(joinMsg).catch(() => {
                                    guild.owner.send(joinMsg)/*.catch(() => {})*/;
                                });
                        });
                    }
                    else channel.send(joinMsg).catch(() => {
                        guild.owner.send(joinMsg)/*.catch(() => {})*/;
                    });
                }
                else
                {
                    if(!channel)
                    {
                        guild.channels.cache.array().forEach(chn => {
                            if(chn.memberPermissions(guild.members.cache.find(m => m.id == client.user.id).hasPermission("SEND_MESSAGES")))
                                chn.send(alreadyExistsMsg).catch(() => {
                                    guild.owner.send(alreadyExistsMsg)/*.catch(() => {})*/;
                                });
                        });
                    }
                    else channel.send(alreadyExistsMsg).catch(() => {
                        guild.owner.send(alreadyExistsMsg)/*.catch(() => {})*/;
                    });
                }
            }).catch(err => {
                guild.owner.send(`Hi, I am ${settings.name} and I was just added to your server, ${guild.name}.\nThere was an error while running the first join procedure and I might not work as expected.\nPlease run the command \`${settings.bot.defaultPrefix} init\` in the server to re-run the first join procedure.\n\nError message: ${err}`)/*.catch(() => {})*/;
            });
        }
        else
        {
            if(!channel)
            {
                guild.channels.cache.array().forEach(chn => {
                    if(chn.memberPermissions(guild.members.cache.find(m => m.id == client.user.id).hasPermission("SEND_MESSAGES")))
                        chn.send(alreadyExistsMsg).catch(() => {
                            guild.owner.send(alreadyExistsMsg)/*.catch(() => {})*/;
                        });
                });
            }
            else channel.send(alreadyExistsMsg).catch(() => {
                guild.owner.send(alreadyExistsMsg)/*.catch(() => {})*/;
            });
        }
    }).catch(err => {
        guild.owner.send(`Hi, I am ${settings.name} and I was just added to your server, ${guild.name}.\nThere was an error while running the first join procedure and I might not work as expected.\nPlease run the command \`${settings.bot.defaultPrefix} init\` in the server to re-run the first join procedure.\n\nError message: ${err}`)/*.catch(() => {})*/;
    });
}

module.exports = firstJoin;
