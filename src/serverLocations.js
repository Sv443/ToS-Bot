const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let locations = [];
module.exports.locations = [];

/**
 * @typedef {Object} DiscordLocation
 * @prop {String} id The ID of the location - something like "europe" or "us-east"
 * @prop {String} name The name of the location - something like "Europe" or "US East"
 */

/**
 * Calls the Discord API to get all the server locations and exposes the variable `locations` after the Promise has resolved
 * @returns {Promise<Array<DiscordLocation>, String>} Resolves with the locations array, rejects with an error message
 */
function init()
{
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open("GET", "https://discordapp.com/api/voice/regions");
        xhr.setRequestHeader("Authorization", `Bot ${process.env.BOT_TOKEN}`);

        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4)
            {
                if(xhr.status < 300)
                {
                    let resp = JSON.parse(xhr.responseText.toString());

                    resp.forEach(itm => {
                        if(!itm.deprecated)
                        {
                            locations.push({
                                id: itm.id,
                                name: itm.name
                            });
                        }
                    });

                    module.exports.locations = locations;
                    return resolve(locations);
                }
                else return reject(`Error ${xhr.status} - ${JSON.parse(xhr.responseText.toString()).message}`);
            }
        }

        xhr.send();
    });
}

module.exports.init = init;
