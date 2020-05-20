const recast = require('ember-template-recast');

/**
 * plugin entrypoint
 */
function transform(root) {
  let b = recast.builders;

  recast.traverse(root, {
    ElementNode(node) {
      // modifier (param)
      if (node.attributes.length) {
        for (let attr of node.attributes) {
          if (attr.value && attr.value.path.original === 'action') {
            attr.value.path = b.path('fn');
          }
        }
      }
      // action handler
      node.modifiers = node.modifiers.map(mod => {
        if (mod.path && mod.path.original === 'action') {
          const params = mod.params;
          const hash = mod.hash;
          let domEventName = 'click';
          // TODO: this should be look through the list first
          if (hash.pairs.length && hash.pairs[0].key === 'on') {
            domEventName = hash.pairs[0].value.original;
          }
          if (params.length && params[0].type === 'StringLiteral' && params[0].value !== 'click') {
            params[0] = b.path(`this.${params[0].original}`);
          }
          mod = b.elementModifier(b.path('on'), [b.string(domEventName)].concat(...params));
        }
        return mod;
      });
    },
  });
}

module.exports = transform;
