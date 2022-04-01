module.exports = {
    "plugins" : [
        ["@electron-forge/plugin-webpack", {
            "mainConfig": "./webpack.main.config.js",
            "renderer": {
                "config": "./webpack.renderer.config.js",
                "nodeIntegration" : true,
                "entryPoints": [{
                    "name": "J.E.S.S.E.",
                    "html": "./src/renderer/index.html",
                    "js": "./src/renderer/index.js"
                }]
            }
        }]
    ],
    "packagerConfig": {},
    "makers": [
        {
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "name": "jesse"
            }
        },
        {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "darwin"
            ]
        },
        {
            "name": "@electron-forge/maker-deb",
            "config": {}
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {}
        }
    ]
}