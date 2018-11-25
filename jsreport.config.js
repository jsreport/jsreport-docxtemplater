
module.exports = {
  'name': 'docxtemplater',
  'main': 'lib/docxtemplater.js',
  'optionsSchema': {
    extensions: {
      'docxtemplater': {
        type: 'object',
        properties: {
          previewInWordOnline: { type: 'boolean' },
          publicUriForPreview: { type: 'string' },
          showWordOnlineWarning: { type: 'boolean', default: true }
        }
      }
    }
  },
  'dependencies': ['templates', 'assets']
}
