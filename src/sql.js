const mysql = require("mysql");
const { join } = require("path");
const fs = require("fs");
const jsl = require("svjsl");
let col = jsl.colors.fg;
col.rst = jsl.colors.rst;

const settings = require("../settings");
const debug = require("./debug");

module.exports.connectionInfo = {
    connected: false,
    info: ""
};


function init()
{
    return new Promise((resolve, reject) => {
        debug("SQL", `Initializing SQL connection on "${settings.sql.dbHost}:${settings.sql.dbPort}/${settings.sql.dbName}", as user "${process.env.DATABASE_USER}"`);

        let sqlConnection = mysql.createConnection({
            database: settings.sql.dbName,
            host: settings.sql.dbHost || "127.0.0.1",
            port: settings.sql.dbPort || 3306,
            user: process.env.DATABASE_USER || "",
            password: process.env.DATABASE_PASSWORD || "",
            timeout: (settings.sql.timeout * 1000) || 10000
        });

        process.sqlConnection = sqlConnection;

        debug("SQL", `Trying to connect to database...`);
        sqlConnection.connect(err => {
            if(err)
            {
                console.log(`${col.red}Error while initializing SQL connection: ${err}${col.rst}`);
                return reject(`${err}\nMaybe the database server isn't running or doesn't allow the connection.`);
            }
            else
            {
                debug("SQL", `Connection was established, checking if all necessary tables exist...`);

                let tableFiles = fs.readdirSync(settings.sql.createTablesDir);

                let promises = [];

                tableFiles.forEach(tf => {
                    if(!tf.endsWith(".sql"))
                        return;
                    
                    let tableName = tf.substring(0, tf.length - 4);

                    promises.push(new Promise((resolve2, reject2) => {
                        sendQuery(`SHOW TABLES LIKE ?`, [tableName]).then(res => {
                            if(typeof res != "object" || res.length <= 0 || !Array.isArray(res))
                            {
                                // table doesn't exist
                                debug("SQL", `Table "${tableName}" doesn't exist, creating it...`);

                                let createTableQuery = null;

                                try
                                {
                                    let filePath = join(settings.sql.createTablesDir, `${tableName}.sql`);
                                    createTableQuery = fs.readFileSync(filePath).toString();

                                    if(!createTableQuery)
                                        return reject2(`Error while reading file "${filePath}" - file is empty or nonexistant`);

                                    sendQuery(createTableQuery).then(() => {
                                        debug("SQL", `Successfully created table "${tableName}"`);
                                        return resolve2();
                                    }).catch(err => {
                                        return reject2(err);
                                    });
                                }
                                catch(err)
                                {
                                    return reject2(err);
                                }
                            }
                            else return resolve2(); // table exists
                        }).catch(err => reject2(err));
                    }));
                });

                Promise.all(promises).then(() => {
                    debug("SQL", `Done checking for nonexistant tables`);
                    return resolve();
                }).catch(err => {
                    return reject(err);
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

        let sendQuery = (typeof insertValues == "object" && insertValues.length > 0) ? process.sqlConnection.format(query, insertValues) : query;

        debug("SQL", `Sending query: ${col.yellow}${sendQuery}${col.rst}`);

        process.sqlConnection.query({
            sql: sendQuery,
            timeout: settings.sql.timeout * 1000
        }, (err, result) => {
            if(err)
                return reject(err);
            else
            {
                try
                {
                    debug("SQL", `Query returned successful`);
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
