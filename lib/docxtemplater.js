const recipe = require('./recipe')
const extend = require('node.extend.without.arrays')

module.exports = function (reporter, definition) {
  definition.options = extend(true, { preview: {} }, reporter.options.office, definition.options)

  reporter.extensionsManager.recipes.push({
    name: 'docxtemplater',
    execute: recipe(reporter, definition)
  })

  reporter.documentStore.registerComplexType('DocxTemplaterType', {
    templateAssetShortid: { type: 'Edm.String' }
  })

  reporter.documentStore.model.entityTypes['TemplateType'].docxtemplater = { type: 'jsreport.DocxTemplaterType', schema: { type: 'null' } }

  reporter.beforeRenderListeners.insert({ before: 'templates' }, 'docxtemplater', (req) => {
    if (req.template && req.template.recipe === 'docxtemplater' && !req.template.name && !req.template.shortid && !req.template.content) {
      // templates extension otherwise complains that the template is empty
      // but that is fine for this recipe
      req.template.content = 'docxtemplater placeholder'
    }
  })

  reporter.initializeListeners.add('docxtemplater', () => {
    if (reporter.express) {
      reporter.express.exposeOptionsToApi(definition.name, {
        preview: {
          enabled: definition.options.preview.enabled,
          showWarning: definition.options.preview.showWarning
        }
      })
    }
  })
}
