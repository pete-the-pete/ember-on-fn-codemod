# on-fn

## Usage

```
npx ember-on-fn-codemod on-fn path/of/files/ or/some**/*glob.js

# or

yarn global add ember-on-fn-codemod
ember-on-fn-codemod on-fn path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [helper-eventhandler](#helper-eventhandler)
* [helper-reference](#helper-reference)
* [helper-string](#helper-string)
* [modifier-default](#modifier-default)
* [modifier-defined](#modifier-defined)
* [modifier-string](#modifier-string)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="helper-eventhandler">**helper-eventhandler**</a>

**Input** (<small>[helper-eventhandler.input.hbs](transforms/on-fn/__testfixtures__/helper-eventhandler.input.hbs)</small>):
```hbs
<div onchange={{action "answerHowYouKnow" value="target.value"}} />
```

**Output** (<small>[helper-eventhandler.output.hbs](transforms/on-fn/__testfixtures__/helper-eventhandler.output.hbs)</small>):
```hbs
<intput {{on 'change' this.answerHowYouKnow}} />
```
---
<a id="helper-reference">**helper-reference**</a>

**Input** (<small>[helper-reference.input.hbs](transforms/on-fn/__testfixtures__/helper-reference.input.hbs)</small>):
```hbs
<Taco @thing={{action this.actionHandler}} />
```

**Output** (<small>[helper-reference.output.hbs](transforms/on-fn/__testfixtures__/helper-reference.output.hbs)</small>):
```hbs
<Taco @thing={{fn this.actionHandler}} />
```
---
<a id="helper-string">**helper-string**</a>

**Input** (<small>[helper-string.input.hbs](transforms/on-fn/__testfixtures__/helper-string.input.hbs)</small>):
```hbs
<Taco @thing={{action "actionHandler"}} />
```

**Output** (<small>[helper-string.output.hbs](transforms/on-fn/__testfixtures__/helper-string.output.hbs)</small>):
```hbs
<Taco @thing={{fn this.actionHandler}} />
```
---
<a id="modifier-default">**modifier-default**</a>

**Input** (<small>[modifier-default.input.hbs](transforms/on-fn/__testfixtures__/modifier-default.input.hbs)</small>):
```hbs
<div {{action this.actionHandler}} />
```

**Output** (<small>[modifier-default.output.hbs](transforms/on-fn/__testfixtures__/modifier-default.output.hbs)</small>):
```hbs
<div {{on "click" this.actionHandler}} />
```
---
<a id="modifier-defined">**modifier-defined**</a>

**Input** (<small>[modifier-defined.input.hbs](transforms/on-fn/__testfixtures__/modifier-defined.input.hbs)</small>):
```hbs
<div {{action this.actionHandler on="mouseover"}} />
```

**Output** (<small>[modifier-defined.output.hbs](transforms/on-fn/__testfixtures__/modifier-defined.output.hbs)</small>):
```hbs
<div {{on "mouseover" this.actionHandler}} />
```
---
<a id="modifier-string">**modifier-string**</a>

**Input** (<small>[modifier-string.input.hbs](transforms/on-fn/__testfixtures__/modifier-string.input.hbs)</small>):
```hbs
<button {{action "foo"}}></button>
```

**Output** (<small>[modifier-string.output.hbs](transforms/on-fn/__testfixtures__/modifier-string.output.hbs)</small>):
```hbs
<button {{on "click" this.foo}}></button>
```
<!--FIXTURES_CONTENT_END-->
