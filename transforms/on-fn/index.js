const path = require('path');

const debug = require('debug')('ember-on-fn-codemod:transform');
const recast = require('ember-template-recast');
const transform = require('./helpers/plugin');

module.exports = function transformer(file /*, api */) {
  let extension = path.extname(file.path);

  if (!['.hbs'].includes(extension.toLowerCase())) {
    debug('Skipping %s because it does not match the .hbs file extension', file.path);

    // do nothing on non-hbs files
    return;
  }

  debug('Parsing %s ...', file.path);
  let root = recast.parse(file.source);

  debug('Transforming %s ...', file.path);
  transform(root);

  debug('Generating new content for %s ...', file.path);
  return recast.print(root);
};
