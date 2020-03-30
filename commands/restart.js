const discord = require("discord.js");
const jsl = require("svjsl");

jsl.unused(discord);

const meta = {
    name: "Restart",
    devOnly: true
};


/**
 * Runs this command
 * @param {discord.Client} client 
 * @param {discord.Message} message 
 * @param {Array<String>} args 
 */
function run(client, message, args)
{
    jsl.unused(client, args);

    message.react("✅").then(() => {
        // Exit with code 2 triggers a restart:
        message.delete({timeout: 500}).then(() => process.exit(2)).catch(() => {});
    });
}

module.exports.meta = Object.freeze(meta);
module.exports.run = run;
