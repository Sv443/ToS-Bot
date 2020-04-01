const Discord = require("discord.js");
const logger = require("../src/logger");
const jsl = require("svjsl");
const settings = require("../settings");
const isDeveloper = require("../src/isDeveloper");

jsl.unused(Discord);

const meta = {
    name: "Execute",
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
    jsl.unused(client);
    try
    {
        if(!isDeveloper(message.author.id))
            return;

        let code = args.join(" ");


        let embed = new Discord.MessageEmbed()
            .setTitle("Execution Result:")
            .setColor(settings.messages.defaultEmbedColor);

        
        let result;
        try
        {
            result = eval(code);
        }
        catch(err)
        {
            embed.setDescription(`Code:\n\`\`\`js\n${code}\n\`\`\`\nError: \n\`\`\`\n${err}\`\`\``);
            embed.setColor("#d6380d");

            message.channel.send(embed).catch(() => {
                message.author.send(embed).catch(() => {});
            });
            
            return;
        }

        if(result instanceof Promise)
        {
            message.react("📨").then(reaction => {
                result.then((res) => {
                    reaction.remove();

                    if(typeof res === "object") // TODO: conversion from Object to String
                    {
                        try
                        {
                            res = JSON.stringify(res, null, 4);
                        }
                        catch(e) // eslint-disable-next-line no-empty
                        {}
                    }

                    embed.setDescription(`Code:\n\`\`\`js\n${code}\n\`\`\`\nResult: \n\`\`\`\n${res}\`\`\``);
                    embed.setColor("#44c947");

                    message.channel.send(embed).catch(() => {
                        message.author.send(embed).catch(() => {});
                    });
                }).catch(err => {
                    embed.setDescription(`Code:\n\`\`\`js\n${code}\n\`\`\`\nError: \n\`\`\`\n${err}\`\`\``);
                    embed.setColor("#d6380d");

                    message.channel.send(embed).catch(() => {
                        message.author.send(embed).catch(() => {});
                    });
                });
            });
        }
        else
        {
            if(typeof result === "object")
            {
                try
                {
                    result = JSON.stringify(result, null, 4);
                }
                catch(e) // eslint-disable-next-line no-empty
                {}
            }
            embed.setDescription(`Code:\n\`\`\`js\n${code}\n\`\`\`\nResult: \n\`\`\`\n${result}\`\`\``);
            embed.setColor("#44c947");
            message.channel.send(embed);
        }
    }
    catch(err)
    {
        logger("Cmd", meta.name, `General Error: ${err} - Args: ${args.join(", ")}`);
    }
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
