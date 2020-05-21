const logger = require('./utils/log');
const recast = require('ember-template-recast');

const domEvents = [
  'onclick',
  'onchange',
  'onmouseup',
  'onmouseover',
  'onmousedown',
  'onkeyup',
  'onkeydown',
];

/**
 * plugin entrypoint
 */
function transform(root) {
  let b = recast.builders;

  function convertStringHandler(params) {
    if (params.length && params[0].type === 'StringLiteral' && params[0].value !== 'click') {
      logger.info('LOL this is probably fine.');
      params[0] = b.path(`this.${params[0].original}`);
    }
  }

  // NOTE: if the [handler] is a String, it should be converted to this.[string], otherwise left as is
  recast.traverse(root, {
    ElementNode(node) {
      /**
       * action helper:
       *  - @thing={{action [handler] ...rest}} ==> {{fn [handler] ..rest}}
       *  - on[event]={{action [handler] ...rest}} ==> {{on "[event]" [handler] ...rest}}
       *  - on[event]={{action [handler] ...rest value=target.value}} ==> {{on "[event]" [handler] ..rest}}
       */
      node.attributes.forEach((attr, index, attributes) => {
        if (attr.value && attr.value.path && attr.value.path.original === 'action') {
          const params = attr.value.params;
          convertStringHandler(params);
          let domEventName = domEvents.filter(e => node.attributes[0].name.includes(e)).pop();
          if (domEventName) {
            node.modifiers.push(
              b.elementModifier(b.path('on'), [b.string(domEventName)].concat(...params))
            );
            attributes.slice(index, 1);
            attributes.length--;
          } else {
            attr.value.path = b.path('fn');
          }
        }
      });

      /**
       * action modifier
       *  - default: <div {{action [handler] ...rest }} /> ==> <div {{on "click" [handler]}}
       *  - defined: <div {{action [handler] ...rest on="[event]"}} /> ==> <div {{on "[event]" [handler] ...rest}}
       */
      node.modifiers = node.modifiers.map(mod => {
        if (mod.path && mod.path.original === 'action') {
          const hash = mod.hash;
          const params = mod.params;
          convertStringHandler(params);
          let domEventName = 'click';
          // TODO: this should be look through the list first
          if (hash.pairs.length && hash.pairs[0].key === 'on') {
            domEventName = hash.pairs[0].value.original;
          }
          mod = b.elementModifier(b.path('on'), [b.string(domEventName)].concat(...params));
        }
        return mod;
      });
    },
  });
}

module.exports = transform;
