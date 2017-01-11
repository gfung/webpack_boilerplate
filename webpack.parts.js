const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');

//dev server setup
exports.devServer = function(options) {
    return {
        devServer: {
            // Enable history API fallback so HTML5 History API based
            // routing works. This is a good default that will come
            // in handy in more complicated setups.
            historyApiFallback: true,

            // Unlike the cli flag, this doesn't set
            // HotModuleReplacementPlugin!
            hot: true,
            inline: true,

            // Display only errors to reduce the amount of output.
            stats: 'errors-only',

            // Parse host and port from env to allow customization.
            //
            // If you use Vagrant or Cloud9, set
            // host: options.host || '0.0.0.0';
            //
            // 0.0.0.0 is available to all network devices
            // unlike default `localhost`.
            host: options.host, // Defaults to `localhost`
            port: options.port, // Defaults to 8080
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            }
        },
        plugins: [
            // Enable multi-pass compilation for enhanced performance
            // in larger projects. Good default.
            new webpack.HotModuleReplacementPlugin(
                // Disabled as this won't work with html-webpack-template yet
                //multiStep: true
                [path.join(__dirname, 'node_modules')]
            ),
        ]
    };
}

//minify js
exports.minify = function() {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                mangle: {
                    except: ['webpackJsonp'],
                    screw_ie8: true
                },

            })
        ]
    };
}

//extra compression
exports.setFreeVariable = function(key, value) {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [
            new webpack.DefinePlugin(env)
        ]
    };
}

//extract into separate bundle
exports.extractBundle = function(options) {
    const entry = {};
    entry[options.name] = options.entries;

    return {
        // Define an entry point needed for splitting.
        entry: entry,
        plugins: [
            // Extract bundle and manifest files. Manifest is
            // needed for reliable caching.
            new webpack.optimize.CommonsChunkPlugin({
                names: [options.name, 'manifest']
            })
        ]
    };
}

//clean files
exports.clean = function(path) {
    return {
        plugins: [
            new CleanWebpackPlugin([path], {
                // Without `root` CleanWebpackPlugin won't point to our
                // project and will fail to work.
                root: process.cwd()
            })
        ]
    };
}

//dev css setup
exports.setupCSS = function(paths) {
    return {
        module: {
            rules: [{
                test: /\.(css|scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                include: paths
            }]
        }
    };
}

// extractcss
exports.extractCSS = function(paths) {
    return {
        module: {
            rules: [
                // Extract SCSS during build
                {
                    test: /\.s?css$/,
                    use: [
                        ExtractTextPlugin.extract('style'),
                        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                        'sass-loader?sourceMap&config=sassLoader'
                    ],
                    include: paths
                }
            ]
        },
        plugins: [
            // Output extracted CSS to a file
            new ExtractTextPlugin('[name].[chunkhash].css')
        ]
    };
}

exports.purifyCSS = function(paths) {
    var options = {
        minify: true,
        info: true
    };
    return {
        plugins: [
            new PurifyCSSPlugin({
                basePath: process.cwd(),
                // `paths` is used to point PurifyCSS to files not
                // visible to Webpack. This expects glob patterns so
                // we adapt here.
                paths: paths.map(path => `${path}/*`),
                // Walk through only html files within node_modules. It
                // picks up .js files by default!
                resolveExtensions: ['.html']
            }, options),
        ]
    }
}

exports.babel = function(path) {
    return {
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                options: {
                    cacheDirectory: true
                },
                include: path
            }]
        }
    }
}

exports.typescript = function() {
    return {
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader'
            }]
        }
    }
}