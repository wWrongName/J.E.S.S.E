const path = require("path")
const webpack = require("webpack")
const { execSync } = require("child_process")
const config = require("./config")

const rendererRules = [
    {
        test : /\.jsx?$/,
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env',
                '@babel/react',{
                    'plugins': [
                        '@babel/plugin-proposal-class-properties'
                    ]
                }
            ]
        }
    },
    {
        test : /\.css$/,
        use : ['style-loader', 'css-loader']
    },
    {
        test : /\.(png|jpg|ico|svg|jpeg|woff|ttf|eot|otf)$/,
        use : 'file-loader'
    }
]

module.exports = () => {
    const MODE   = config.mode
    const SOURCE = path.join(__dirname, "./renderer")
    const PUBLIC = path.join(__dirname, "./public")
    const VERSION = execSync('git rev-parse --short HEAD').toString().trim()
    
    let plugins = []
    plugins.push(new webpack.DefinePlugin({
        VERSION : JSON.stringify(VERSION),
        MODE : JSON.stringify(MODE),
        WINCONFIG : JSON.stringify(config.window)
    }))

    return {
        entry : {
            app : path.resolve(SOURCE, 'app/index.js')
        },
        output : {
            path : PUBLIC,
            filename : 'js/jesse.[name].js'
        },
        module : {
            rules : rendererRules
        },
        devtool: 'inline-source-map',
        mode : MODE,
        plugins,
        devServer : {
            port : config.port
        }
    }
}