const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('node:path')

const config = getDefaultConfig(__dirname)
config.watchFolders = [path.resolve(__dirname, '../shared')]

// Evita saturar los archivos abiertos de Metro en Windows.
if (process.platform === 'win32') config.maxWorkers = 2

module.exports = withNativeWind(config, { input: './src/global.css' })
