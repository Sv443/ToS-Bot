const jsl = require("svjsl");
const Discord = require("discord.js");
jsl.unused(Discord);


/**
 * @param {Discord.Guild} guild
 * @param {String} setting 
 */
function get(guild, setting)
{
    // TODO: all of this
    jsl.unused(guild, setting);
    return null;
}

/**
 * @param {Discord.Guild} guild 
 * @param {String} setting 
 * @param {String|Number|null} value
 */
function set(guild, setting, value)
{
    // TODO: all of this
    jsl.unused(guild, setting, value);
    return true;
}

module.exports = { get, set };
