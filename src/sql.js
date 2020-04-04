const mysql = require("mysql");
const fs = require("fs");
const jsl = require("svjsl");
let col = jsl.colors.fg;
col.rst = jsl.colors.rst;

const settings = require("../settings");

module.exports.connectionInfo = {
    connected: false,
    info: ""
};


function init()
{
    return new Promise((resolve, reject) => {
        let sqlConnection = mysql.createConnection({
            database: settings.sql.dbName,
            host: settings.sql.dbHost || "127.0.0.1",
            port: settings.sql.dbPort || 3306,
            user: process.env.DATABASE_USER || "",
            password: process.env.DATABASE_PASSWORD || ""
        });

        process.sqlConnection = sqlConnection;

        sqlConnection.connect(err => {
            if(err)
            {
                console.log(`${col.red}Error while initializing SQL connection: ${err}${col.rst}`);
                return reject(`${err}\nMaybe the database server isn't running or doesn't allow the connection.`);
            }
            else
            {
                sendQuery(`SHOW TABLES LIKE "${settings.sql.guildSettings.tableName}"`).then(res => {
                    if(typeof res != "object" || res.length <= 0)
                    {
                        let createTableQuery = fs.readFileSync(settings.sql.guildSettings.createTableFile).toString();
                        sendQuery(createTableQuery).then(() => {
                            module.exports.connectionInfo = {
                                connected: true,
                                info: `${settings.sql.dbHost}:${settings.sql.dbPort}/${settings.sql.dbName}`
                            };
                            return resolve();
                        }).catch(err => {
                            return reject(`${err}\nMaybe the database server isn't running or doesn't allow the connection.`);
                        });
                    }
                    else
                    {
                        module.exports.connectionInfo = {
                            connected: true,
                            info: `${settings.sql.dbHost}:${settings.sql.dbPort}/${settings.sql.dbName}`
                        };
                        return resolve();
                    }
                }).catch(err => {
                    return reject(`${err}\nMaybe the database server isn't running or doesn't allow the connection.`);
                });
            }
        });

        sqlConnection.on("error", err => {
            return reject(`${err}\nMaybe the database server isn't running or doesn't allow the connection.`);
        });
    });
}

/**
 * Sends a formatted (SQLI-protected) query
 * @param {String} query The SQL query with question marks where the values are
 * @param {Array<String|Number|null>} [insertValues] An array of values to insert into the question marks - use the primitive type null for an empty value
 * @returns {Promise} Returns a Promise - resolves with the query results or rejects with the error string
 */
const sendQuery = (query, insertValues) => {
    return new Promise((resolve, reject) => {
        if(jsl.isEmpty(process.sqlConnection) || (process.sqlConnection && process.sqlConnection.state != "connected" && process.sqlConnection.state != "authenticated"))
            return reject(`DB connection is not established yet. Current connection state is "${process.sqlConnection ? process.sqlConnection.state || "disconnected" : "null"}"`);

        process.sqlConnection.query({
            sql: (typeof insertValues == "object" && insertValues.length > 0) ? process.sqlConnection.format(query, insertValues) : query,
            timeout: settings.sql.timeout * 1000
        }, (err, result) => {
            if(err)
                return reject(err);
            else
            {
                try
                {
                    if(resolve)
                        return resolve(JSON.parse(JSON.stringify(result)));
                }
                catch(err)
                {
                    return reject(err);
                }
            }
        });
    });
};

/**
 * Ends the SQL connection
 * @returns {Promise}
 */
const endConnection = () => {
    return new Promise((resolve) => {
        this.sqlConn.end(err => {
            if(err)
                this.sqlConn.destroy();
            resolve();
        });
    });
};

module.exports = { init, sendQuery, endConnection };
