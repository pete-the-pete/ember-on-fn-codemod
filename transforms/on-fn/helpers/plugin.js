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
function transform(root, file) {
  let b = recast.builders;

  function convertStringHandler(file, params) {
    if (params.length && params[0].type === 'StringLiteral' && params[0].value !== 'click') {
      logger.warn(
        [
          `TACO TACO Converting "${params[0].original}" to 'this.${params[0].original}'`,
          `at ${JSON.stringify(params[0].loc.start)} of ${file.path}.`,
          `\nPlease verify 'this.${params[0].original}' exists in the backing javascript class.`,
        ].join('')
      );
      params[0] = b.path(`this.${params[0].original}`);
    }
  }

  // NOTE: if the [handler] is a String, it should be converted to this.[string], otherwise left as is
  recast.traverse(root, {
    ElementNode(node) {
      const logMessages = [];
      /**
       * action helper:
       *  - @thing={{action [handler] ...rest}} ==> {{fn [handler] ..rest}}
       *  - on[event]={{action [handler] ...rest}} ==> {{on "[event]" [handler] ...rest}}
       *  - on[event]={{action [handler] ...rest value=target.value}} ==> {{on "[event]" [handler] ..rest}}
       */
      node.attributes.forEach((attr, index, attributes) => {
        if (attr.value && attr.value.path && attr.value.path.original === 'action') {
          const params = attr.value.params;
          convertStringHandler(file, params);
          let domEventName = domEvents.filter(e => attr.name.includes(e.toLowerCase())).pop();
          if (domEventName) {
            const _eventName = domEventName.substr(2);
            logMessages.push(
              `Converting "${domEventName}" attribute to '{{on "${_eventName}" ...}}' modifier`
            );
            node.modifiers.push(
              b.elementModifier(b.path('on'), [b.string(domEventName.substr(2))].concat(...params))
            );
            // remove the attribute from the node
            attributes.splice(index, 1);
          } else {
            logMessages.push(
              `Converting "${attr.name}" attribute from '{{action ...' to '{{fn ...}}'`
            );
            attr.value.path = b.path('fn');
          }
          logMessages.push(`at ${JSON.stringify(attr.loc.start)} of ${file.path}.`);
          logMessages.push(
            `\nPlease verify the action 'this.${params[0].original}' is expecting and handling the event appropriately.`
          );
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
          convertStringHandler(file, params);
          let domEventName = hash.pairs.filter(pair => pair.key === 'on').pop();
          if (domEventName) {
            domEventName = domEventName.value.original;
          } else {
            domEventName = 'click';
          }
          logMessages.push(`Converting modifier from '{{action ...' to '{{on ...}}'.`);
          logMessages.push(`at ${JSON.stringify(mod.loc.start)} of ${file.path}.`);
          logMessages.push(
            `\nPlease verify the action 'this.${mod.original}' is expecting and handling the event appropriately.`
          );
          mod = b.elementModifier(b.path('on'), [b.string(domEventName)].concat(...params));
        }
        return mod;
      });

      if (logMessages.length) {
        logger.warn(logMessages.join(''));
      }
    },
  });
}

module.exports = transform;
