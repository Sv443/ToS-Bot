const jsl = require("svjsl");
const Discord = require("discord.js");

const settings = require("../settings");
const debug = require("../src/debug");
const sql = require("../src/sql");

jsl.unused(Discord);


/**
 * @param {Discord.Guild} guild
 * @param {String} setting 
 * @returns {Promise}
 */
function get(guild, setting)
{
    return new Promise((resolve, reject) => {
        if(!guild || !guild.id)
            return reject(`Error: parameter "guild" is not set`);

        sql.sendQuery(`SELECT * FROM \`${settings.guildSettings.dbTableName}\` WHERE GuildID = ?`, guild.id).then(gs => {
            let settingVal = gs[0][setting];

            debug("GuildSettings", `Value of "${setting}" is "${settingVal}"`);

            if(settingVal)
                return resolve(settingVal);
            else return resolve(null);
        }).catch((err) => {
            return reject(err);
        });
    });
}

/**
 * @param {Discord.Guild} guild 
 * @param {String} setting 
 * @param {String|Number|null} value
 * @returns {Promise}
 */
function set(guild, setting, value)
{
    return new Promise((resolve, reject) => {
        if(!guild || !guild.id)
            return reject(`Error: parameter "guild" is not set`);

        sql.sendQuery(`UPDATE \`${settings.guildSettings.dbTableName}\` SET \`${setting}\` = ? WHERE GuildID = ?`, value, guild.id).then(res => {
            debug("GuildSettings", `Set "${setting}" to value "${value}"`);
            return resolve();
        }).catch(err => reject(err));
    });
}

module.exports = { get, set };
