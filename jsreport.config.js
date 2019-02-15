
module.exports = {
  'name': 'docxtemplater',
  'main': 'lib/docxtemplater.js',
  'optionsSchema': {
    extensions: {
      'docxtemplater': {
        type: 'object',
        properties: {
          previewInWordOnline: { type: 'boolean', $exposeToApi: true },
          publicUriForPreview: { type: 'string' },
          showWordOnlineWarning: { type: 'boolean', default: true, $exposeToApi: true }
        }
      }
    }
  },
  'dependencies': ['templates', 'assets']
}
