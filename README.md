# jsreport-docxtemplater
[![NPM Version](http://img.shields.io/npm/v/jsreport-docxtemplater.svg?style=flat-square)](https://npmjs.com/package/jsreport-docxtemplater)
[![Build Status](https://travis-ci.org/jsreport/jsreport-docxtemplater.png?branch=master)](https://travis-ci.org/jsreport/jsreport-docxtemplater)
jsreport recipe for creating docx word document using [docxtemplater](https://docxtemplater.readthedocs.io/en/latest/)

See https://jsreport.net/learn/docxtemplater

## Installation

> **npm install jsreport-docxtemplater**


## jsreport-core
You can apply this extension also manually to [jsreport-core](https://github.com/jsreport/jsreport-core)

```js
var jsreport = require('jsreport-core')()
jsreport.use(require('jsreport-docxtemplater')())

const result = await reporter.render({
  template: {
      engine: 'none',
      recipe: 'docxtemplater',
      docxtemplater: {
        templateAsset: {
          content: fs.readFileSync(path.join(__dirname, 'template.docx'))
        }
      }
    },
    data: {
      name: 'John'
    }
  }
)
```
