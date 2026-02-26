import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react'
import { IDENTIFY_MAX_FILE_SIZE_MB } from '../services/identifyService'

type IdentifyUploadFormProps = {
  fileInputRef: RefObject<HTMLInputElement | null>
  previewUrl?: string
  selectedFileName?: string
  isUploading: boolean
  errorMessage?: string
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

  const handleUploadPhotoClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    openFilePicker()
  }

  const handleResetClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    resetSelection()
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
              onClick={handleUploadPhotoClick}
            >
              Upload photo
            </button>
            {hasSelection && (
              <button
                type="button"
                className="identifier__ghost"
                onClick={handleResetClick}
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
    </form>
  )
}

export default IdentifyUploadForm
