exports.pages = function (env, folder = '') {
  const rootPagesFolderName = 'pages'
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  const fs = require('fs')
  const path = require('path')
  const viewsFolder = path.resolve(__dirname, `../src/pug/${rootPagesFolderName}/${folder}`)

  let pages = []

  fs.readdirSync(viewsFolder).forEach(view => {
    if (view.split('.')[1] === undefined)
      return false;

    const options = {
      filename:  `${folder}/index.html`,
      template: `src/pug/${rootPagesFolderName}/${folder}/index.pug`,
      inject: true
    };

    if (env === 'development') {
      options.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      };
    }

    pages.push(new HtmlWebpackPlugin(options));
  })

  return pages;
}
