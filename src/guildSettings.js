const jsl = require("svjsl");
const Discord = require("discord.js");
jsl.unused(Discord);

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
