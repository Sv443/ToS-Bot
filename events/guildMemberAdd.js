const Discord = require("discord.js");
const jsl = require("svjsl");
jsl.unused(Discord);

const settings = require("../settings");
const guildSettings = require("../src/guildSettings");

const meta = {
    name: "Member Joined",
    description: `Fires off every time someone joins a guild ${settings.name} is part of`
}

/**
 * Is run when this event gets triggered
 * @param {Discord.Client} client 
 * @param {Array<Discord.GuildMember>} args 
 */
function run(client, args)
{
    jsl.unused(client);

    let member = args[0];

    guildSettings.get(member.guild, "AnnounceMemberStatus").then(announce => {
        if(announce == 1)
        {
            guildSettings.get(member.guild, "LogChannelID").then(logChannel => {
                let joinEmbed = new Discord.MessageEmbed()
                    .setDescription(``)

                if(logChannel)
                    member.guild.channels.cache.find(ch => ch.id === logChannel).send(joinEmbed)/*.catch(() => {})*/;
            });
        }
    }).catch((err) => {
        console.log(err);
    });
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
