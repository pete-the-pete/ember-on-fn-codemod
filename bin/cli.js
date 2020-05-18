#!/usr/bin/env node
'use strict';

const args = process.argv.slice(3);

(async () => {
  require('codemod-cli').runTransform(__dirname, 'on-fn', args, 'hbs');
})();
