const office = require('jsreport-office')

module.exports = {
  name: 'docxtemplater',
  main: 'lib/docxtemplater.js',
  optionsSchema: office.extendSchema('docxtemplater', {}),
  dependencies: ['templates', 'assets']
}
