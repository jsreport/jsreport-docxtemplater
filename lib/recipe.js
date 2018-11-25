const Docxtemplater = require('docxtemplater')
const JSZip = require('jszip')
const axios = require('axios')
const FormData = require('form-data')

module.exports = (reporter, definition) => async (req, res) => {
  if (!req.template.docxtemplater || (!req.template.docxtemplater.templateAsset && !req.template.docxtemplater.templateAssetShortid)) {
    throw reporter.createError(`docxtemplater requires template.docxtemplater.templateAsset or template.docxtemplater.templateAssetShortid to be set`, {
      statusCode: 400
    })
  }

  let templateAsset = req.template.docxtemplater.templateAsset

  if (req.template.docxtemplater.templateAssetShortid) {
    templateAsset = await reporter.documentStore.collection('assets').findOne({ shortid: req.template.docxtemplater.templateAssetShortid }, req)

    if (!templateAsset) {
      throw reporter.createError(`Asset with shortid ${req.template.docxtemplater.templateAssetShortid} was not found`, {
        statusCode: 400
      })
    }
  } else {
    if (!Buffer.isBuffer(templateAsset.content)) {
      templateAsset.content = Buffer.from(templateAsset.content)
    }
  }

  const zip = new JSZip(templateAsset.content)
  const docx = new Docxtemplater()
  docx.loadZip(zip)

  docx.setData(req.data)
  docx.render()
  const result = docx.getZip().generate({
    type: 'nodebuffer'
  })

  if (!req.options.preview || definition.options.previewInWordOnline === false) {
    res.meta.fileExtension = 'docx'
    res.meta.contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    res.content = result
    return
  }

  const form = new FormData()
  form.append('field', result, 'file.docx')
  const resp = await axios.post(definition.options.publicUriForPreview || 'http://jsreport.net/temp', form, {
    headers: form.getHeaders()
  })

  const iframe = '<iframe style="height:100%;width:100%" src="https://view.officeapps.live.com/op/view.aspx?src=' +
    encodeURIComponent((definition.options.publicUriForPreview || 'http://jsreport.net/temp' + '/') + resp.data) + '" />'
  const html = '<html><head><title>jsreport</title><body>' + iframe + '</body></html>'
  res.content = Buffer.from(html)
  res.meta.contentType = 'text/html'
}
