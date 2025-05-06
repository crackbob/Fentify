const path = require("path");
const { UserscriptPlugin } = require("webpack-userscript");

const commonConfig = {
    mode: "production",
    entry: "./src/main.js",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
};

const userscriptConfig = {
    ...commonConfig,
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "Fentify.user.js",
    },
    plugins: [
        new UserscriptPlugin({
            metajs: false,
            headers: {
                name: "Fentify",
                supportURL: "https://github.com/crackbob/Fentify",
                description: "we do a little trolling",
                version: "1.0.0",
                author: "crackbob",
                match: "*://Vectaria.io/*",
                grant: "none",
            },
        }),
    ],
};

const regularScriptConfig = {
    ...commonConfig,
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "Fentify.min.js",
    },
    plugins: [],
};

module.exports = [userscriptConfig, regularScriptConfig];