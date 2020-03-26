const discord = require("discord.js");
require("dotenv").config();

const client = new discord.Client({
    fetchAllMembers: true,
    presence: {
        status: "online"
    }
});



client.login()
