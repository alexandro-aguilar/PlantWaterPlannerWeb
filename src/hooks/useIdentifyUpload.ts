import {
  type ChangeEvent,
  type RefObject,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IDENTIFY_ALLOWED_MIME_TYPES,
  IDENTIFY_MAX_FILE_SIZE_BYTES,
  IDENTIFY_MAX_FILE_SIZE_MB,
  identifyPlantFromImage,
} from '../services/identifyService'
import type { IdentifyResultLocationState } from '../types/identifyResultState'

type IdentifyUploadHook = {
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

export function useIdentifyUpload(): IdentifyUploadHook {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>()
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const revokePreview = useCallback((url?: string) => {
    if (url) {
      URL.revokeObjectURL(url)
    }
  }, [])

  useEffect(() => {
    return () => {
      revokePreview(previewUrl)
    }
  }, [previewUrl, revokePreview])

  const resetSelection = useCallback(() => {
    setSelectedFile(null)
    setErrorMessage(undefined)
    setPreviewUrl((previous) => {
      revokePreview(previous)
      return undefined
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [revokePreview])

  const handleInvalidSelection = useCallback(
    (message: string) => {
      setSelectedFile(null)
      setErrorMessage(message)
      setPreviewUrl((previous) => {
        revokePreview(previous)
        return undefined
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [revokePreview],
  )

  const handleFileSelection = useCallback(
    (file: File | null) => {
      if (!file) {
        return
      }

      const isMimeValid =
        file.type !== '' && IDENTIFY_ALLOWED_MIME_TYPES.includes(file.type)
      const hasJpegExtension = /\.jpe?g$/i.test(file.name)

      if (!isMimeValid && !hasJpegExtension) {
        handleInvalidSelection('Please choose a JPG image file.')
        return
      }

      if (file.size > IDENTIFY_MAX_FILE_SIZE_BYTES) {
        handleInvalidSelection(
          `Please choose a JPG image smaller than ${IDENTIFY_MAX_FILE_SIZE_MB}MB.`,
        )
        return
      }

      setErrorMessage(undefined)
      setSelectedFile(file)
      setPreviewUrl((previous) => {
        revokePreview(previous)
        return URL.createObjectURL(file)
      })
    },
    [handleInvalidSelection, revokePreview],
  )

  const onFileInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null
      handleFileSelection(file)
    },
    [handleFileSelection],
  )

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!selectedFile) {
        setErrorMessage('Choose a JPG photo to identify your plant.')
        return
      }

      setIsUploading(true)
      setErrorMessage(undefined)

      try {
        const plant = await identifyPlantFromImage(selectedFile)
        const resultState: IdentifyResultLocationState = {
          plant,
          imageFile: selectedFile,
          fileName: selectedFile.name,
        }
        navigate('/result', { state: resultState })
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'We were unable to identify your plant. Try again.'
        setErrorMessage(message)
      } finally {
        setIsUploading(false)
      }
    },
    [navigate, selectedFile],
  )

  return {
    fileInputRef,
    previewUrl,
    selectedFileName: selectedFile?.name,
    isUploading,
    errorMessage,
    hasSelection: Boolean(selectedFile),
    onFormSubmit,
    onFileInputChange,
    openFilePicker,
    resetSelection,
  }
}
