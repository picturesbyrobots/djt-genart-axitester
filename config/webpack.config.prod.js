const CopyPlugin = require("copy-webpack-plugin")
const config = require("./webpack.config")
const ZipperPlugin = require("./ZipperPlugin")
const path = require("path")

module.exports = {
  ...config,
  mode: "production",
  // add the zipper plugin to the list of plugins
  plugins: [
    ...config.plugins,
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          // prevents the index.html from being copied to the the public folder, as it's going to be
          // generated by webpack
          filter: async (filePath) => {
            filtered_files = ["index.html", "sandbox.html", "preview.html", "preview.css", "sandbox.css"]
            return !filtered_files.includes(path.basename(filePath))
          }
        }
      ]
    }),
    new ZipperPlugin()
  ]
}