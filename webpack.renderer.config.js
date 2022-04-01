const path = require("path")

module.exports = () => {
    const MODE              = process.env.NODE_ENV || 'development'
    const SOURCE_RENDERER   = path.join(__dirname, "./src/renderer")
    const PUBLIC            = path.join(__dirname, "./public")

    return {
        entry : {
            app : [path.resolve(SOURCE_RENDERER, 'index.js')]
        },
        output : {
            path : PUBLIC,
            filename : 'js/jesse.[name].js'
        },
        module : {
            rules : [
                {
                    test : /\.jsx?$/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env',
                            '@babel/react',{
                                'plugins': ['@babel/plugin-proposal-class-properties']
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
        },
        devtool: 'inline-source-map',
        mode : MODE,
        devServer : {
            contentBase : PUBLIC
        }
    }
}