require('should')
const jsreport = require('jsreport-core')
const fs = require('fs')
const path = require('path')
const util = require('util')
const textract = util.promisify(require('textract').fromBufferWithName)

describe('docxtemplater', () => {
  let reporter

  beforeEach(() => {
    reporter = jsreport({
      templatingEngines: {
        strategy: 'in-process'
      }
    }).use(require('../')())
      .use(require('jsreport-templates')())
      .use(require('jsreport-assets')())
    return reporter.init()
  })

  afterEach(() => reporter.close())

  it('should produce word with replaced tags', async () => {
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
    })

    const text = await textract('test.docx', result.content)
    text.should.containEql('Hello world John')
  })

  it('should be able to reference stored asset', async () => {
    await reporter.documentStore.collection('assets').insert({
      name: 'template.docx',
      shortid: 'template',
      content: fs.readFileSync(path.join(__dirname, 'template.docx'))
    })
    const result = await reporter.render({
      template: {
        engine: 'none',
        recipe: 'docxtemplater',
        docxtemplater: {
          templateAssetShortid: 'template'
        }
      },
      data: {
        name: 'John'
      }
    })

    const text = await textract('test.docx', result.content)
    text.should.containEql('Hello world John')
  })

  it('preview request should return html', async () => {
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
      },
      options: {
        preview: true
      }
    })

    result.content.toString().should.containEql('iframe')
  })
})

describe('docxtemplater with extensions.docxtemplater.preview.enabled === false', () => {
  let reporter

  beforeEach(() => {
    reporter = jsreport({
      templatingEngines: {
        strategy: 'in-process'
      }
    }).use(require('../')({ preview: { enabled: false } }))
      .use(require('jsreport-templates')())
      .use(require('jsreport-assets')())
    return reporter.init()
  })

  afterEach(() => reporter.close())

  it('preview request should not return html', async () => {
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
      },
      options: {
        preview: true
      }
    })

    result.content.toString().should.not.containEql('iframe')
  })
})
