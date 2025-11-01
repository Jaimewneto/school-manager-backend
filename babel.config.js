const tsconfig = require('./tsconfig.json');

const alias = {};

// converte o tsconfig para o formato do module-resolver do babel
// ex: "@crons": "./src/crons"
Object.entries(tsconfig.compilerOptions.paths).map(((el, v) => {
    const [key, value] = el;

    const newKey = key.replace('/*', '');
    const newValue = value[0].replace('/*', '');

    if (!alias[newKey]) {
        alias[newKey] = newValue;
    }
}));

module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    node: "current",
                },
            },
        ],
        "@babel/preset-typescript",
    ],
    sourceMaps: true,
    plugins: [
        [
            "module-resolver", { alias: alias },
        ],
    ],
    ignore: ["**/*.spec.ts"],
};