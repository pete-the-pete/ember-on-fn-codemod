const recast = require('ember-template-recast');

/**
 * plugin entrypoint
 */
function transform(root) {
  let b = recast.builders;

  recast.traverse(root, {
    ElementNode(node) {
      if (node.attributes) {
        for (let attr of node.attributes) {
          if (attr.value && attr.value.path.original === 'action') {
            attr.value.path = b.path('fn');
          }
        }
      }
    },

    ElementModifierStatement(node) {
      if (node.path.original === 'action') {
        node.path = b.path('on');
        const params = node.params;
        if (params && params[0].type === 'StringLiteral') {
          params[0] = b.path(`this.${params[0].original}`);
        }
        node.params = [b.string('click'), ...params];
      }
    },
  });
}

module.exports = transform;
