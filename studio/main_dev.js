import Properties from './DocxTemplaterProperties'
import Studio from 'jsreport-studio'

Studio.addPropertiesComponent(Properties.title, Properties, (entity) => entity.__entitySet === 'templates' && entity.recipe === 'docxtemplater')

Studio.addApiSpec({
  template: {
    docxtemplater: {
      templateAsset: {
        encoding: '...',
        content: '...'
      },
      templateAssetShortid: '...'
    }
  }
})

Studio.previewListeners.push((request, entities) => {
  if (request.template.recipe !== 'docxtemplater') {
    return
  }

  if (Studio.extensions.docxtemplater.options.previewInOfficeOnline === false) {
    return
  }

  if (Studio.getSettingValueByKey('office-preview-informed', false) === true) {
    return
  }

  Studio.setSetting('office-preview-informed', true)

  Studio.openModal(() => <div>
    We need to upload your docx report to our publicly hosted server to be able to use
    Office Online Service for previewing here in the studio. You can disable it in the configuration, see <a
      href='https://jsreport.net/learn/docxtemplater' target='_blank'>https://jsreport.net/learn/docxtemplater</a> for details.
  </div>)
})
