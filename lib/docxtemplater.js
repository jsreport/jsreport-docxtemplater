const recipe = require('./recipe')

module.exports = function (reporter, definition) {
  reporter.extensionsManager.recipes.push({
    name: 'docxtemplater',
    execute: recipe(reporter, definition)
  })

  reporter.documentStore.registerComplexType('DocxTemplaterType', {
    templateAssetShortid: { type: 'Edm.String' }
  })

  reporter.documentStore.model.entityTypes['TemplateType'].docxtemplater = { type: 'jsreport.DocxTemplaterType' }

  reporter.beforeRenderListeners.insert({ before: 'templates' }, 'docxtemplater', (req) => {
    if (req.template && req.template.recipe === 'docxtemplater' && !req.template.name && !req.template.shortid && !req.template.content) {
      // templates extension otherwise complains that the template is empty
      // but that is fine for this recipe
      req.template.content = 'docxtemplater placeholder'
    }
  })
}
