const Discord = require("discord.js");
const path = require("path");
const debug = require("./debug");
const fs = require("fs");
const jsl = require("svjsl");
const col = jsl.colors.fg;
col.rst = jsl.colors.rst;
const settings = require("../settings");
const DBL = require("dblapi.js");

const guildSettings = require("./guildSettings");
const isDeveloper = require("./isDeveloper");
const serverLocations = require("./serverLocations");
const sql = require("./sql");

require("dotenv").config();

const client = new Discord.Client({
    fetchAllMembers: true,
    presence: {
        status: "online"
    }
});


let dbl = {};
if(settings.enableDblApi)
    dbl = new DBL(process.env.DBL_TOKEN, client);


const commands = [];
const events = [];


//#MARKER Init
//#SECTION PreInit
function preInit()
{
    return new Promise((resolve, reject) => {
        let promises = [registerCommands(), registerEvents(), serverLocations.init(), sql.init()];
        debug("PreInit", `Initializing ${promises.length} components...`);

        Promise.all(promises).then(() => {
            debug("PreInit", `Done initializing all ${promises.length} components`);
            return resolve({
                commands: commands,
                events: events,
                serverLocations: serverLocations.locations
            });
        }).catch(err => {
            return reject(`PreInit Err: ${err}`);
        });
    });
}

//#SECTION Init
function init()
{
    return new Promise((resolve, reject) => {
        debug("Init", `Initializing Discord API connection...`);
        client.login(process.env.BOT_TOKEN).then(() => {
            debug("Init", `Discord API connection successfully established`);
            client.once("message", (msg) => messageReceived(msg));

            if(settings.enableDblApi)
            {
                postDblStats();
                setInterval(() => postDblStats(), 12 * 60 * 60 * 1000); // every 12 hours
            }

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
        debug("InitAll", `Calling PreInit...`);
        let bot = await preInit();
        debug("InitAll", `PreInit has finished, calling Init...`);
        
        module.exports.commands = Object.freeze(bot.commands);
        module.exports.events = Object.freeze(bot.events);
        module.exports.serverLocations = Object.freeze(bot.serverLocations);

        init().then(() => {
            debug("InitAll", `Init has finished, bot is ready to serve`);
            let totalGuilds = client.guilds.cache.size;
            console.log("\n\n");
            console.log(`${col.blue}${settings.name} is ready to serve in ${totalGuilds} guild${totalGuilds == 1 ? "" : "s"}.${col.rst}\n`);
            console.log(`${col.yellow}Commands:    ${col.rst}${bot.commands.filter(c => c.meta.devOnly == false).map(c => c = c.name).join(", ")}`);
            console.log(`${col.yellow}DevCommands: ${col.rst}${bot.commands.filter(c => c.meta.devOnly == true).map(c => c = c.name).join(", ")}`);
            console.log(`${col.yellow}Events:      ${col.rst}${bot.events.join(", ")}`);


            if(!jsl.inDebugger())
            {
                process.stdin.setRawMode(true);
                process.stdout.write(`\n\n[r] restart - [s] stop  > `);
                process.stdin.resume();
        
                let onData = chunk => {
                    if(/\u0003/gu.test(chunk)) // eslint-disable-line no-control-regex
                        process.exit(0);
                    
                    chunk = chunk.toString();

                    switch(chunk)
                    {
                        case "r":
                            console.log(`\n\n${col.magenta}Restarting.${col.rst}\n`);
                            return process.exit(2);
                        case "s":
                            console.log(`\n\n${col.red}Stopping.${col.rst}\n`);
                            return process.exit(0);
                        default: return;
                    }
                }
        
                process.stdin.on("data", onData);
        
                process.stdin.on("error", err => {
                    console.error(`${col.red}Error while initializing ${settings.name}: ${err}`);
                    return process.exit(1);
                });
            }
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
            
            debug("RegisterCommands", `Found ${files.length} files, trying to register them...`);

            files.forEach(itm => {
                if(!itm.endsWith(".js"))
                    return;
                    
                let command = itm.substring(0, itm.length - 3);

                try
                {
                    // TODO: register aliases
                    let req = require(path.join(settings.commands.folder, itm));
                    commands.push({
                        name: command,
                        meta: req.meta,
                        run: req.run
                    });
                    debug("RegisterCommands", `Successfully registered the command "${command}"`);
                }
                catch(err)
                {
                    return reject(`RegisterEvents Err while registering command "${command}": ${err}`);
                }
            });

            debug("RegisterCommands", `Registered ${commands.length} of ${files.length} commands`);

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
            
            debug("RegisterEvents", `Found ${files.length} files, trying to register them...`);

            files.forEach(itm => {
                if(!itm.endsWith(".js"))
                    return;
                    
                let event = itm.substring(0, itm.length - 3);

                try
                {
                    client.once(event, (...args) => {
                        require(path.join(settings.events.folder, itm)).run(client, args);
                    });

                    events.push(event);

                    debug("RegisterEvents", `Successfully registered the event "${event}"`);
                }
                catch(err)
                {
                    return reject(`RegisterEvents Err while registering event "${event}": ${err}`);
                }
            });

            debug("RegisterEvents", `Registered ${events.length} of ${files.length} events`);

            return resolve();
        });
    });
}

/**
 * Gets called on received message
 * @param {Discord.Message} message 
 */
function messageReceived(message)
{
    if(message.author.bot || message.channel.type == "dm")
        return;

    debug("MessageReceived", `Received message from "${message.author.tag}" in "${message.guild.name}": "${message.content}"`);

    let cont = () => {
        if(prefix.length > 1)
            prefix += " ";
        
        if(message.content.startsWith(prefix) || message.content.startsWith("tos "))
        {
            if(message.content.startsWith("tos "))
                prefix = "tos ";

            let msgParts = message.content.substring(prefix.length).split(" ");
            let command = msgParts[0];

            msgParts.shift();
            let args = msgParts;

            let foundCommand = commands.find(cmd => cmd.name === command);

            if(foundCommand)
            {
                if(!foundCommand.meta.devOnly || (foundCommand.meta.devOnly === true && isDeveloper(message.author.id)))
                {
                    // process.stdout.write("*");
                    foundCommand.run(client, message, args);
                }
                else message.channel.send("\\*beep boop\\* You don't look like my master, I'm not letting you use that! \\*beep beep\\*");
            }
            else message.reply(`I don't know that command. Use "${prefix}help" to see all available commands.`);
        }
    };

    let prefix = settings.bot.defaultPrefix;
    guildSettings.get(message.guild, "CmdPrefix").then(gsPrefix => {
        prefix = gsPrefix;
        cont();
    }).catch(() => {
        prefix = settings.bot.defaultPrefix;
        cont();
    });
}

//#SECTION Other
function postDblStats()
{
    debug("PostDblStats", `Sending guild size of ${client.guilds.size} to DBL API`);
    if(settings.enableDblApi)
        dbl.postStats(client.guilds.size);
}

initAll();
