const Discord = require("discord.js");
const path = require("path");
const fs = require("fs");
const jsl = require("svjsl");
const col = jsl.colors.fg;
col.rst = jsl.colors.rst;
const settings = require("../settings");
const DBL = require("dblapi.js");

const guildSettings = require("./guildSettings");
const isDeveloper = require("./isDeveloper");

require("dotenv").config();
const dbl = new DBL(process.env.DBL_TOKEN, client);

const client = new Discord.Client({
    fetchAllMembers: true,
    presence: {
        status: "online"
    }
});

const commands = [];
const events = [];

//#MARKER Init
//#SECTION PreInit
function preInit()
{
    return new Promise((resolve, reject) => {
        let promises = [registerCommands(), registerEvents()];

        Promise.all(promises).then(() => {
            return resolve({ commands, events });
        }).catch(err => {
            return reject(`PreInit Err: ${err}`);
        });
    });
}

//#SECTION Init
function init()
{
    return new Promise((resolve, reject) => {
        client.login(process.env.BOT_TOKEN).then(() => {
            client.on("message", (msg) => messageReceived(msg));

            postDblStats();
            setInterval(() => postDblStats(), 12 * 60 * 60 * 1000); // every 12 hours

            return resolve();
        }).catch(err => {
            return reject(`Init Err: ${err}`);
        });
    });
}

//#SECTION Init All
async function initAll()
{
    try
    {
        let bot = await preInit();
        
        module.exports.commands = Object.freeze(bot.commands);
        module.exports.commands = Object.freeze(bot.events);

        init().then(() => {
            let totalGuilds = client.guilds.cache.size;
            console.log("\n\n");
            console.log(`${settings.name} is ready to serve in ${totalGuilds} guild${totalGuilds == 1 ? "" : "s"}.`);
            console.log(`Commands: ${bot.commands.map(c => c = c.name).join(", ")}`);
            console.log(`Events: ${bot.events.join(", ")}`);
            console.log("\n");
        }).catch(err => {
            console.error(`${col.red}Error while initializing ${settings.name}: ${err}`);
            return process.exit(1);
        });
    }
    catch(err)
    {
        console.error(`${col.red}Error while initializing ${settings.name}: ${err}`);
        return process.exit(1);
    }
}

//#MARKER Bot
//#SECTION Register Commands
function registerCommands()
{
    return new Promise((resolve, reject) => {
        fs.readdir(settings.commands.folder, (err, files) => {
            if(err)
                return reject(err);
            
            files.forEach(itm => {
                if(!itm.endsWith(".js"))
                    return;
                    
                let command = itm.substring(0, itm.length - 3);

                try
                {
                    let req = require(path.join(settings.commands.folder, itm));
                    commands.push({
                        name: command,
                        meta: req.meta,
                        run: req.run
                    });
                }
                catch(err)
                {
                    return reject(`RegisterEvents Err while registering command "${command}": ${err}`);
                }
            });

            return resolve();
        });
    });
}

//#SECTION Register Events
function registerEvents()
{
    return new Promise((resolve, reject) => {
        fs.readdir(settings.events.folder, (err, files) => {
            if(err)
                return reject(err);
            
            files.forEach(itm => {
                if(!itm.endsWith(".js"))
                    return;
                    
                let event = itm.substring(0, itm.length - 3);

                try
                {
                    client.on(event, (...args) => {
                        require(path.join(settings.events.folder, itm)).run(client, args);
                    });

                    events.push(event);
                }
                catch(err)
                {
                    return reject(`RegisterEvents Err while registering event "${event}": ${err}`);
                }
            });

            return resolve();
        });
    });
}

/**
 * 
 * @param {discord.Message} message 
 */
function messageReceived(message)
{
    if(message.author.bot)
        return;

    let prefix = guildSettings.get(message.guild, "general", "prefix") || settings.bot.defaultPrefix;
    if(prefix.length > 1)
        prefix += " ";
    
    if(message.content.startsWith(prefix))
    {
        let msgParts = message.content.substring(prefix.length).split(" ");
        let command = msgParts[0];

        msgParts.shift();
        let args = msgParts;

        let foundCommand = commands.find(cmd => cmd.name === command);

        if(foundCommand)
        {
            console.log(`Received command "${command}" with args "${args.join(`", "`)}"`);

            if(!foundCommand.meta.devOnly || (foundCommand.meta.devOnly === true && isDeveloper(message.author.id)))
                foundCommand.run(client, message, args);
        }
        else message.reply(`I don't know that command. Use "${prefix}help" to see all available commands.`);
    }
}

//#SECTION Other
function postDblStats()
{
    dbl.postStats(client.guild.size);
}

initAll();
