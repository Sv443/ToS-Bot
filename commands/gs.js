const Discord = require("discord.js");
const jsl = require("svjsl");

const settings = require("../settings");
const logger = require("../src/logger");
const guildSettings = require("../src/guildSettings");
const sql = require("../src/sql");

jsl.unused(Discord, settings);

const meta = {
    name: "GuildSettings",
    devOnly: true
};


/**
 * Runs this command
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 */
function run(client, message, args)
{
    jsl.unused(client, message);
    try
    {
        let type = args[0];
        let settingName = args[1];
        if(type == "get")
        {
            guildSettings.get(message.guild, settingName).then(settingVal => {
                message.channel.send(`The value of the setting "${settingName}" is "${settingVal}"`);
            }).catch(err => {
                message.channel.send(`Error: ${err}`);
            });
        }
        else if(type == "set")
        {
            args.shift();
            args.shift();
            let val = args.join(" ");

            guildSettings.set(message.guild, settingName, val).then(() => {
                message.channel.send(`Successfully set the value of the setting "${settingName}" to "${val}"`);
            }).catch(err => {
                message.channel.send(`Error: ${err}`);
            });
        }
        else if(type == "getall")
        {
            sql.sendQuery(`SELECT * FROM \`${settings.guildSettings.dbTableName}\` WHERE GuildID = ?`, message.guild.id).then(res => {
                message.channel.send(`\`\`\`json\n${JSON.stringify(res, null, 4)}\`\`\``);
            }).catch(err => {
                message.channel.send(`Error: ${err}`);
            });
        }
        else message.channel.send(`Invalid type "${type}". Available types are: "get", "set" and "getall"`);
    }
    catch(err)
    {
        logger("Cmd", meta.name, `General Error: ${err} - Args: ${args.join(", ")}`);
    }
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
