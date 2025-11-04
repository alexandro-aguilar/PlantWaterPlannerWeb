import { type FC } from 'react'
import IdentifyUploadForm from '../components/IdentifyUploadForm'
import { useIdentifyUpload } from '../hooks/useIdentifyUpload'

const IdentifyUploadContainer: FC = () => {
  const upload = useIdentifyUpload()

  return (
    <IdentifyUploadForm
      fileInputRef={upload.fileInputRef}
      previewUrl={upload.previewUrl}
      selectedFileName={upload.selectedFileName}
      isUploading={upload.isUploading}
      errorMessage={upload.errorMessage}
      result={upload.result}
      hasSelection={upload.hasSelection}
      onFormSubmit={upload.onFormSubmit}
      onFileInputChange={upload.onFileInputChange}
      openFilePicker={upload.openFilePicker}
      resetSelection={upload.resetSelection}
    />
  )
}

export default IdentifyUploadContainer
