const Discord = require("discord.js");
const jsl = require("svjsl");

const settings = require("../settings");
const guildSettings = require("./guildSettings");

const filter = require(settings.messages.wordBlacklistFile);
const badWordResponses = [
    "*beep boop* I detect bad word from %USER% *boop beep*",
    "%USER%, do you kiss your mother with that mouth?",
    "Watch your profanity %USER%!"
];

/**
 * @param {Discord.Message} message
 */
function checkBadMessage(message)
{
    let originalMessageContent = message.content.toLowerCase();
    let messageContent = message.content.toLowerCase().replace(/([|^`´?.\-_,\s*])/gm, "");
    let messageLightCheckContent = message.content.toLowerCase();

    let botLogs = guildSettings.get(message.guild, "LogChannelID");

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

    if(isbadword && botLogs)
    {
        let embed = new Discord.RichEmbed()
            .setTitle(`‼ There could have been a bad word in the following message:`)
            .addField("User:", `${message.author}`, true)
            .addField("Channel:", `${message.channel}>`, true)
            .addBlankField()
            .addField("Content:", `\`\`\`\n${originalMessageContent.replace(/`/gm, "´")}\n\`\`\``, false)
            .addBlankField()
            .addField(`Triggered on word${triggerWords.length == 1 ? "" : "s"}:`, `\`\`\`\n${triggerWords.join(", ")}\`\`\``, true)
            .addBlankField()
            .setDescription(lightcheckisbadword ? "**I deleted their message as the chance the message was toxic was pretty high.**" : "**I didn't delete their message as the chance the message was toxic was too low.**")
            .setColor("#ffaa00")
            .setFooter(`(\` replaced with ´) - ${new Date().toUTCString()}`);

        if(!lightcheckisbadword)
            botLogs.send(embed);
    }

    if(lightcheckisbadword)
    {
        let response = badWordResponses[jsl.randRange(0, badWordResponses.length - 1)];
        message.channel.send(response.replace("%USER%", message.member)).then(() => {}).catch(() => {});
        message.author.send(`You might have said a bad word which I had to filter out!\n\n**Channel:** \`#${message.channel.name}\`\n\n**Message:**\n\`\`\`${originalMessageContent}\`\`\`\n\n**The filter triggered on the ${(triggerWords.length <= 1 ? "word:** `" : "words:** `") + jsl.readableArray(triggerWords, ", ", " and ")}\`\n\nThanks for understanding.`).catch(() => {});
        message.delete().then(() => {
            if(!message.author.bot && botLogs)
            {
                let embed = new Discord.RichEmbed()
                    .setTitle(`‼ Bad word filter was triggered, message was deleted`)
                    .addField("User:", `${message.author}`, true)
                    .addField("Channel:", `${message.channel}`, true)
                    .addBlankField()
                    .addField("Content:", `\`\`\`\n${originalMessageContent.replace(/`/gm, "´")}\n\`\`\``, false)
                    .addBlankField()
                    .addField(`Triggered on word${triggerWords.length == 1 ? "" : "s"}:`, `\`\`\`\n${triggerWords.join(", ")}\`\`\``, true)
                    .setColor("#ff0000")
                    .setFooter(`(\` replaced with ´) - ${new Date().toUTCString()}`);

                if(isbadword && lightcheckisbadword)
                    return botLogs.send(embed).then(() => {}).catch(() => {});
                else return;
            }
        }).catch(() => {});
    }
}

module.exports = checkBadMessage;
