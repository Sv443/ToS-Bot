const jsl = require("svjsl");
const discord = require("discord.js");
jsl.unused(discord);

/**
 * @typedef {("general")} GSSection
 */

/**
 * @param {discord.Guild} guild 
 * @param {GSSection} section 
 * @param {String} setting 
 */
function get(guild, section, setting)
{
    jsl.unused(guild, section, setting);
    return null;
}

function set(guild, section, setting, value)
{
    jsl.unused(guild, section, setting, value);
    return true;
}

module.exports = { get, set };
