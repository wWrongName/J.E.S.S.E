const path = require("path")

const logDir = path.join(__dirname, "logs")

module.exports = {
    apps : [
        {
            name : "electron_dev",
            script : "node_modules/electron/cli.js",
            args : ".",
            exec_mode : "fork",
            merge_logs: false,
            log_file : path.join(logDir, "electron_dev.log"),
            env: {
                "NODE_ENV": "development",
            },
            watch : false
        },
        {
            name : "webpack_dev",
            script : "node_modules/webpack-cli/bin/cli.js",
            args : "serve",
            exec_mode : "fork",
            merge_logs: false,
            log_file : path.join(logDir, "webpack_dev.log"),
            env: {
                "NODE_ENV": "development",
            },
            watch : false
        },
        {
            name : "test",
            script : "node_modules/electron/cli.js",
            args : ".",
            exec_mode : "fork",
            merge_logs: true,
            log_file : path.join(logDir, "test.log"),
            env: {
                "NODE_ENV": "test",
            },
            watch : false
        }
    ]
}