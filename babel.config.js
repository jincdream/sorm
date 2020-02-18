module.exports = {
  presets: [
    // [
    //   '@babel/preset-env',
      // {
      //   loose: true,
      //   modules: false,
      // },
    // ],
    [
      "@babel/preset-env",
      {
        loose: true,
        modules: false,
        "targets": {
          "esmodules": true
        }
      }
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-syntax-dynamic-import'],
};
