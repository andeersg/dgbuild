# Drupal Gutenberg Helper

A build script with some extra features.

It's powered by esbuild.


## Usage

Install it in your module:

```
npm install dgbuild
```

Create a config file `dgbuild.config.json`

```
{
  "src_folder": "blocks/src",
  "dist_folder": "blocks/dest",
  "outfile": "index.js",
  "banner": "// Generated file, do not edit directly.\n",
  "defaultCategory": {
    "slug": "custom",
    "title": "Custom blocks"
  }
}
```

Add the command to package.json

```
"scripts": {
  "build": "dgbuild build",
  "watch": "dgbuild watch"
}
```

By default it expects your block files to be located directly in the `src_folder`:

```
.
└── blocks
    ├── out
    │   └── index.js
    └── src
        ├── Banner.js
        ├── Card.js
        ├── Cta.js
        ├── helpers
        │   └── index.js // Not loaded by default, must be imported in one of the blocks.
        └── utils
            └── media.js // Not loaded by default, must be imported in one of the blocks.
```

but you can override the glob pattern by specifing another in your config:

```
{
  glob: ['*.js'],
}
```

## Options

### src_folder

* Type: `string`
* Default: `''`

### dist_folder

* Type: `string`
* Default: `''`

### outfile

* Type: `string`
* Default: `index.js`

The name of the generated file. 

### banner

* Type: `string`
* Default: `''`

A comment that will be put on top of the compiled file. *Must* be a valid comment (`// Generated file\n`)

### defaultCategory

* Type: `object`
* Default: `{slug: 'default', title: 'Default'}`

The category used for all blocks not specifying a category of their own.

### glob

* Type: `string[]`
* Default: `[*.js]`

Array of patterns to find block src files.

## Extra

The package provides a base class that can be built upon that can be imported like this:

```
const { blockEditor } = wp;
const { RichText } = blockEditor;
const __ = Drupal.t;

import {DefaultBlock} from 'dgbuild';

class Headline extends DefaultBlock {
  edit({ className, attributes, setAttributes }) {
    const { title } = attributes;
  
    return (
      <div className={className}>
        <RichText
          identifier="title"
          tagName="h1"
          value={title}
          placeholder={__('Title')}
          onChange={n => setAttributes({title: n})}
          onSplit={() => null}
          unstableOnSplit={() => null}
        />
      </div>
    );
  }

  getAttributes() {
    return {
      title: {
        type: 'string',
      },
    };
  }
}

const headline = new Headline('headline', __('Headline'), 'welcome-learn-more');

headline.setDescription(__('A styled headline'));

export default headline;

```