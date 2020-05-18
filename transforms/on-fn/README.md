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
* [action-param](#action-param)
* [action-with-string](#action-with-string)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="action-param">**action-param**</a>

**Input** (<small>[action-param.input.hbs](transforms/on-fn/__testfixtures__/action-param.input.hbs)</small>):
```hbs
<Taco @thing={{action this.actionHandler}} />
```

**Output** (<small>[action-param.output.hbs](transforms/on-fn/__testfixtures__/action-param.output.hbs)</small>):
```hbs
<Taco @thing={{fn this.actionHandler}} />
```
---
<a id="action-with-string">**action-with-string**</a>

**Input** (<small>[action-with-string.input.hbs](transforms/on-fn/__testfixtures__/action-with-string.input.hbs)</small>):
```hbs
<button {{action "foo"}}></button>
```

**Output** (<small>[action-with-string.output.hbs](transforms/on-fn/__testfixtures__/action-with-string.output.hbs)</small>):
```hbs
<button {{on "click" this.foo}}></button>
```
<!--FIXTURES_CONTENT_END-->
