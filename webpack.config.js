const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    devtool: false,
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve( "./build" ),
        library: {
            type: "module"
        }
    },
    experiments: {
        outputModule: true,
    },
    optimization: {
        minimize: true
    },
    externals: {
        "@nikonov-alex/reactor": "@nikonov-alex/reactor",
        "jsx-dom": "jsx-dom"
    }
};