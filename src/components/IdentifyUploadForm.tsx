import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  type RefObject,
} from 'react'
import {
  IDENTIFY_MAX_FILE_SIZE_MB,
  type PlantIdentification,
} from '../services/identifyService'

type IdentifyUploadFormProps = {
  fileInputRef: RefObject<HTMLInputElement>
  previewUrl?: string
  selectedFileName?: string
  isUploading: boolean
  errorMessage?: string
  result?: PlantIdentification
  hasSelection: boolean
  onFormSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onFileInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  openFilePicker: () => void
  resetSelection: () => void
}

const IdentifyUploadForm: FC<IdentifyUploadFormProps> = ({
  fileInputRef,
  previewUrl,
  selectedFileName,
  isUploading,
  errorMessage,
  result,
  hasSelection,
  onFormSubmit,
  onFileInputChange,
  openFilePicker,
  resetSelection,
}) => {
  const triggerClassName = [
    'identifier__dropzone',
    previewUrl ? 'identifier__dropzone--preview' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <form className="identifier" onSubmit={onFormSubmit} noValidate>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,.jpg,.jpeg"
        capture="environment"
        className="identifier__file-input"
        onChange={onFileInputChange}
      />

      <div className="identifier__actions">
        <button
          className="identifier__submit"
          type="submit"
          disabled={!hasSelection || isUploading}
        >
          {isUploading ? 'Sending photo…' : 'Identify my plant'}
        </button>
      </div>

      {errorMessage && (
        <p className="identifier__status identifier__status--error">
          {errorMessage}
        </p>
      )}

      {result && (
        <section className="identifier__result">
          <h2 className="identifier__result-title">{result.name}</h2>
          <p className="identifier__result-subtitle">
            <em>{result.scientific_name}</em>
          </p>
          <dl className="identifier__result-grid">
            <div className="identifier__result-item">
              <dt>Sunlight Preference</dt>
              <dd>{result.sunlight_preference}</dd>
            </div>
            <div className="identifier__result-item">
              <dt>Watering Frequency</dt>
              <dd>Every {result.watering_frequency_days} days</dd>
            </div>
            <div className="identifier__result-item">
              <dt>Current Condition</dt>
              <dd>{result.current_condition}</dd>
            </div>
            <div className="identifier__result-item identifier__result-item--full">
              <dt>Care Notes</dt>
              <dd>{result.care_notes}</dd>
            </div>
          </dl>
        </section>
      )}
    </form>
  )
}

export default IdentifyUploadForm
