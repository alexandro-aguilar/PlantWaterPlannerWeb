import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import {
  IDENTIFY_MAX_FILE_SIZE_MB,
  type PlantIdentification,
} from '../services/identifyService'

type IdentifyUploadFormProps = {
  fileInputRef: RefObject<HTMLInputElement | null>
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

  const handleDropzoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openFilePicker()
    }
  }

  return (
    <form className="identifier" onSubmit={onFormSubmit} noValidate>
      <div
        className={triggerClassName}
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={handleDropzoneKeyDown}
        aria-label="Upload a photo of your plant"
      >
        {previewUrl ? (
          <div className="identifier__preview">
            <img
              src={previewUrl}
              alt="Selected plant preview"
              className="identifier__preview-image"
            />
          </div>
        ) : (
          <div className="identifier__dropzone-empty">
            <span className="identifier__pill">JPG only</span>
            <p className="identifier__dropzone-title">
              Drop or click to add a plant photo
            </p>
            <p className="identifier__dropzone-subtitle">
              Up to {IDENTIFY_MAX_FILE_SIZE_MB}MB. We will use this photo to
              identify your plant and offer care tips.
            </p>
          </div>
        )}

        <div className="identifier__dropzone-footer">
          <div className="identifier__selection">
            {selectedFileName ? (
              <span title={selectedFileName}>{selectedFileName}</span>
            ) : (
              <span>No photo selected yet</span>
            )}
          </div>
          <div className="identifier__dropzone-actions">
            <button
              type="button"
              className="identifier__secondary identifier__secondary--accent"
              onClick={openFilePicker}
            >
              Upload photo
            </button>
            {hasSelection && (
              <button
                type="button"
                className="identifier__ghost"
                onClick={resetSelection}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,.jpg,.jpeg"
        capture="environment"
        className="identifier__file-input"
        onChange={onFileInputChange}
        placeholder="Upload a photo of your plant"
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
