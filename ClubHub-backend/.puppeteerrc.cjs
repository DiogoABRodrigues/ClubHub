const { join } = require("path");

// Chrome é descarregado durante `npm install` e incluído no artefacto do Render.
module.exports = { cacheDirectory: join(__dirname, ".cache", "puppeteer") };
