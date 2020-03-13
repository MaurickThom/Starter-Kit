'use strict';
/**
 * los loader iran en module
 * cada modulo tendrá una regla que se va a definir a cada objeto, un objeto para babel
 * otro para css otro para interpretar js
 */

const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: ['@babel/polyfill','../src/main.js']
    },
    mode:"development",
    output: {
        path: path.resolve(__dirname,'..', 'dist'),
        filename: 'js/[name].js'
    },
    devServer: {
        contentBase: path.join(__dirname,'..','dist'),
        compress : true,
        open : true
    }
};
