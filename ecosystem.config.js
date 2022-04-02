const path = require("path")

const logDir = path.join(__dirname, "logs")

module.exports = {
    apps : [
        {
            name : "dev",
            script : "node_modules/electron/cli.js",
            args : ".",
            exec_mode : "fork",
            merge_logs: false,
            log_file : path.join(logDir, "dev.log"),
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