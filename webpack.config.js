// "use strict";
/**
 * los loader iran en module
 * cada modulo tendrá una regla que se va a definir a cada objeto, un objeto para babel
 * otro para css otro para interpretar js
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const postcssPresetEnv = require("postcss-preset-env");
const path = require("path");

const REGEX_JS = /^(?!.*\.{test,min}\.js$).*\.js$/i
const REGEX_STYLES = /\.(sa|sc|c)ss$/

module.exports = {
    devtool: "source-map",
    entry: {
        app: ["@babel/polyfill", "./src/main.js",'./src/scss/style.scss']
    },
    mode: "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].js"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        open: true
    },
    module: {
        rules: [
            {
                test: REGEX_JS,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    },
                    // {
                    //     loader: "eslint-loader",
                    //     options: {
                    //         cache: true,
                    //         failOnError: true,
                    //         emitWarning: true,
                    //         configFile: "./.eslintrc.json"
                    //     }
                    // }
                ]
            },
            {
                test: REGEX_STYLES ,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../"
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 2
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: () => [
                                postcssPresetEnv({
                                    browsers: "last 2 versions",
                                    autoprefixer: {
                                        grid: true,
                                        cascade: false
                                    },
                                    stage: 3,
                                    features: {
                                        "nesting-rules": true
                                    }
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.pug$/,
                use: "pug-loader"
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]"
                        }
                    }
                ],
                exclude: path.resolve(__dirname, "./src/index.html")
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "img/"
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "fonts/"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //   title: 'My App',
        //   filename: 'index.html',
        //   template: 'src/index.html',

        //   minify: {
        //     collapseWhitespace: false,
        //     removeComments: true,
        //     removeRedundantAttributes: true,
        //     removeScriptTypeAttributes: true,
        //     removeStyleLinkTypeAttributes: true,
        //     useShortDoctype: true,
        //   },

        // }),
        new HtmlWebpackPlugin({
            title: 'Webpack Starter',
            template: './src/index.pug'
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "[id].css"
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.(sa|sc|c)ss$/,
            cssProcessor: require("cssnano"),
            cssProcessorPluginOptions: {
                preset: [
                    "default",
                    {
                        discardComments: { removeAll: true }
                    }
                ]
            },
            canPrint: true
        })
    ]
};
