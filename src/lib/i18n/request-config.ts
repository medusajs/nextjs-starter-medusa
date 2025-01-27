const { getRequestConfig } = require("next-intl/server")
const { getI18NConfigCallback } = require("./config-callback")
module.exports = getRequestConfig(getI18NConfigCallback)