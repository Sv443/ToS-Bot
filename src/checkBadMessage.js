const Discord = require("discord.js");
const jsl = require("svjsl");

const settings = require("../settings");
const guildSettings = require("./guildSettings");

const filter = require(settings.messages.wordBlacklistFile);
const badWordResponses = [
    "\\*beep boop\\* I detect bad word from %USER% \\*boop beep\\*",
    "%USER%, do you kiss your mother with that mouth?",
    "Watch your profanity %USER%!"
];

/**
 * @param {Discord.Message} message
 */
function checkBadMessage(message)
{
    let originalMessageContent = message.content;
    let messageLightCheckContent = originalMessageContent.toLowerCase();
    let messageContent = messageLightCheckContent.replace(/([|^`´?.\-_,\s*])/gm, "");

    let isbadword = false, lightcheckisbadword = false, triggerWords = [], triggerWordsLight = [];
    
    filter.forEach(itm => {
        if(messageContent.includes(itm.toLowerCase()))
        {
            isbadword = true;
            triggerWords.push(itm);
        }
        
        if(messageLightCheckContent.includes(itm.toLowerCase()))
        {
            lightcheckisbadword = true;
            triggerWordsLight.push(itm);
        }
    });
    
    if(isbadword || lightcheckisbadword)
    {
        guildSettings.get(message.guild, "LogChannelID").then(botLogsID => {
            let botLogs;
            try
            {
                botLogs = message.guild.channels.cache.find(ch => ch.id == botLogsID);
            }
            catch(err)
            {
                botLogs = null;
            }
            
            if(isbadword && botLogs)
            {
                //spacer: .addField("\u200b", "\u200b")
                let embed = new Discord.MessageEmbed()
                    .setTitle(`⚠️ There could have been a bad word in a member's message`)
                    .addField("User:", `${message.author} / \`${message.author.tag}\``, true)
                    .addField("Channel:", `${message.channel}`, true)
                    .addField("Content:", `\`\`\`\n${originalMessageContent.replace(/`/gm, "´")}\n\`\`\``, false)
                    .addField(`Triggered on word${triggerWords.length == 1 ? "" : "s"}:`, triggerWords.join(", "), true)
                    .setDescription("I didn't delete their message as the chance the message was toxic was too low.\nIf you want this message to be deleted, click on the trash can reaction within the next five hours (you need the \"Manage Messages\" permission).\n\u200b")
                    .setColor("#ffaa00")
                    .setFooter(`(\` replaced with ´) - ${new Date().toUTCString()}`);

                if(!lightcheckisbadword)
                {
                    botLogs.send(embed).then(blMsg => {
                        blMsg.react("🗑").then(() => {
                            let filter = (reaction, user) => ["🗑"].includes(reaction.emoji.name) && user.id === message.author.id && !user.bot;

                            blMsg.awaitReactions(filter, {
                                max: 1,
                                time: 1000 * 60 * 60 * 5,
                                errors: ["time"]
                            }).then(collected => {
                                let reaction = collected.first();

                                if(reaction.emoji.name === "🗑")
                                {
                                    collected.first().users.cache.array().forEach(user => {
                                        if(user instanceof Discord.User)
                                        {
                                            if(message.channel.permissionsFor(user).has("MANAGE_MESSAGES"))
                                            {
                                                let embed2 = new Discord.MessageEmbed()
                                                    .setTitle(`⚠️ There could have been a bad word in a member's message`)
                                                    .addField("User:", `${message.author} / \`${message.author.tag}\``, true)
                                                    .addField("Channel:", `${message.channel}`, true)
                                                    .addField("Content:", `\`\`\`\n${originalMessageContent.replace(/`/gm, "´")}\n\`\`\``, false)
                                                    .addField(`Triggered on word${triggerWords.length == 1 ? "" : "s"}:`, triggerWords.join(", "), true)
                                                    .setDescription(`I didn't delete their message as the chance the message was toxic was too low.\nEdit: A manual deletion was triggered by the user ${user} / \`${user.tag}\`\n\u200b`)
                                                    .setColor("#ffaa00")
                                                    .setFooter(`(\` replaced with ´) - ${new Date().toUTCString()}`);
                                                blMsg.edit(embed2);

                                                message.delete();
                                                blMsg.reactions.removeAll().then(() => {
                                                    blMsg.react("✅").then(() => setTimeout(() => {
                                                        blMsg.reactions.removeAll()/*.catch(() => {})*/;
                                                    }, 3000))/*.catch(() => {})*/;
                                                })/*.catch(() => {})*/;
                                            }
                                        }
                                    });
                                }
                            })/*.catch(() => {})*/;
                        })/*.catch(() => {})*/;
                    })/*.catch(() => {})*/;
                }
            }

            if(lightcheckisbadword)
            {
                let response = badWordResponses[jsl.randRange(0, badWordResponses.length - 1)];
                message.channel.send(response.replace("%USER%", message.member)).then(() => {})/*.catch(() => {})*/;

                let uEmbed = new Discord.MessageEmbed()
                    .setTitle("The bad word filter was triggered on your message")
                    .setDescription(`You have said ${triggerWords.length == 1 ? "a bad word" : "bad words"} in the server "${message.guild.name}" which I had to filter out.`)
                    .addField("Channel:", `[\`#${message.channel.name}\`](https://discordapp.com/channels/${message.guild.id}/${message.channel.id})`, true)
                    .addField("Filter triggered on:", triggerWords.join(", "), true)
                    .addField("Original Message:", `\`\`\`\n${originalMessageContent.replace(/`/g, "´")}\`\`\``)
                    .setColor("#ee3333")
                    .setFooter(`(\` replaced with ´) - ${new Date().toUTCString()}`);
                message.author.send(uEmbed)/*.catch(() => {})*/;

                message.delete().then(() => {
                    if(!message.author.bot && botLogs)
                    {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`‼ Bad word filter was triggered, message was deleted`)
                            .addField("User:", `${message.author} / \`${message.author.tag}\``, true)
                            .addField("Channel:", `${message.channel}`, true)
                            .addField("Content:", `\`\`\`\n${originalMessageContent.replace(/`/gm, "´")}\n\`\`\``, false)
                            .addField(`Triggered on word${triggerWords.length == 1 ? "" : "s"}:`, triggerWords.join(", "), true)
                            .setColor("#ee3333")
                            .setFooter(`(\` replaced with ´) - ${new Date().toUTCString()}`);

                        if(isbadword && lightcheckisbadword)
                            return botLogs.send(embed).then(() => {})/*.catch(() => {})*/;
                        else return;
                    }
                }).catch(() => {
                    return botLogs.send(`I tried to remove a toxic message in the channel #${message.channel.name} just now but I am missing the permissions to do so.`);
                });
            }
        })/*.catch(() => {})*/;
    }
}

module.exports = checkBadMessage;
