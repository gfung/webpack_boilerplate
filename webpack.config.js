const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
//split config file
const parts = require('./webpack.parts');

const PATHS = {
    app: [
        path.join(__dirname, 'app'),
    ],
    build: path.join(__dirname, 'build'),
    style: [
        path.join(__dirname, 'node_modules\\bootstrap\\scss', 'bootstrap.scss')
        // path.join(__dirname, 'app', 'main.css'),
    ]
};

const common = {
    entry: {
        app: PATHS.app,
        style: PATHS.style
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack demo'
        })
    ],
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        alias: {
            'react': 'react-lite',
            'react-dom': 'react-lite'
        }
    }
};



module.exports = function(env) {
    process.env.BABEL_ENV = env;
    if (env === 'build') {
        return merge(
            common, {
                devtool: 'source-map',
                output: {
                    path: PATHS.build,
                    filename: '[name].[chunkhash].js',
                    // This is used for code splitting. The setup
                    // will work without but this is useful to set.
                    chunkFilename: '[chunkhash].js'
                }
            },
            parts.clean(PATHS.build),
            parts.setFreeVariable(
                'process.env.NODE_ENV',
                'production'
            ),
            parts.extractBundle({
                name: 'vendor',
                entries: ['react']
            }),
            parts.minify(),
            parts.extractCSS(PATHS.style),
            parts.purifyCSS([PATHS.app]),
            // parts.typescript(),
            parts.babel([PATHS.app])
        );
    }

    return merge(
        common, {
            devtool: 'eval-source-map',
            // Disable performance hints during development
            performance: {
                hints: false
            }
        },
        parts.typescript(),
        parts.setupCSS(PATHS.style),
        parts.devServer({
            // Customize host/port here if needed
            host: process.env.HOST,
            port: process.env.PORT
        })
    );
};