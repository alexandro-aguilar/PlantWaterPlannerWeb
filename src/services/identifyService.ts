import { Amplify } from 'aws-amplify';
import { uploadData } from '@aws-amplify/storage';

export type PlantIdentification = {
  name: string
  scientific_name: string
  sunlight_preference: string
  watering_frequency_days: number
  current_condition: string
  care_notes: string
}

export type PlantIdentificationResponse = {
  result?: {
    plant?: PlantIdentification
  }
  message?: string
}

export const IDENTIFY_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/pjpeg']

export const IDENTIFY_MAX_FILE_SIZE_MB = 8
export const IDENTIFY_MAX_FILE_SIZE_BYTES =
  IDENTIFY_MAX_FILE_SIZE_MB * 1024 * 1024

const IDENTIFY_ENDPOINT = buildIdentifyEndpoint()
// const PRESIGNED_URL_ENDPOINT = buildPresignedUrlEndpoint()
const STORAGE_BUCKET = 'plant-water-planner-bucket'
const STORAGE_REGION =
  import.meta.env.VITE_STORAGE_REGION ?? import.meta.env.VITE_AWS_REGION ?? 'us-east-1'

const IDENTIFY_STORAGE_PREFIX =
  import.meta.env.VITE_IDENTIFY_STORAGE_PREFIX ?? 'identifications/'

let storageConfigured = false

export async function identifyPlantFromImage(
  file: File,
): Promise<PlantIdentification> {
  try {
    const presignedUrl = await getPresignedUrlForImageUpload(file);

    const { bucket, key } = await uploadImageToStorage(file, presignedUrl);
    console.log('Image uploaded to storage:', { bucket, key });
    // const response = await fetch(presignedUrl, {
    //   method: 'PUT',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ bucket, key }),
    // });
    // console.log('Identify response status:', response.status);
    // if (!response.ok) {
    //   const message = await parseIdentifyError(response);
    //   throw new Error(
    //     message ?? 'Something went wrong while identifying your plant.',
    //   );
    // }

    // const payload = (await response.json()) as PlantIdentificationResponse
    // const plant = payload.result?.plant

    // if (!plant) {
    //   throw new Error(
    //     'The server response did not include plant details. Try again.',
    //   )
    // }

    return plant;
  } catch (error) {
    console.error('Error identifying plant:', error)
    throw new Error('Failed to identify plant')
  }
}

export function buildIdentifyEndpoint(): string {
  const explicitEndpoint = import.meta.env.VITE_IDENTIFY_ENDPOINT
  if (explicitEndpoint) {
    return explicitEndpoint
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '')
  const rawPath =
    import.meta.env.VITE_IDENTIFY_PATH?.trim() ?? '/api/plants/identify'
  const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`

  if (baseUrl) {
    return `${baseUrl}${normalizedPath}`
  }

  return normalizedPath
}

async function uploadImageToStorage(
  file: File,
  url: string
): Promise<{ bucket: string; key: string }> {
    console.log('Uploading image to presigned URL:', url);
    const newUrl = 'http://localhost:4566' + url.split('4566')[1];
    console.log('Modified URL for localstack:', newUrl);
    console.log(file.name);
    const response = await fetch(newUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });
    console.log('Upload response status:', response.status);
    // const key = buildStorageObjectKey(file.name)
  // const uploadTask = await uploadData({
  //   path: key,
  //   data: file,
  //   options: {
  //     bucket: {
  //       bucketName: STORAGE_BUCKET,
  //       region: STORAGE_REGION,
  //     },
      
  //   }
  // }).result;

  // console.log('Upload task result:', uploadTask);
  // const uploadTask = await uploadFile({
  //   input: async () =>
  //     ({
  //       data: file,
  //       key,
  //       options: {
  //         bucket: STORAGE_BUCKET,
  //         accessLevel: 'guest',
  //         contentType: file.type || 'image/jpeg',
  //       },
  //     }) satisfies UploadDataInput,
  // })
  // await uploadTask.result

  return {
    bucket: STORAGE_BUCKET,
    key: file.name,
  }
}

async function getPresignedUrlForImageUpload(file: File): Promise<string> {
  const PRESIGNED_URL_ENDPOINT = 'http://ee9f4168.execute-api.localhost.localstack.cloud:4566/get-upload-url?filename=IMG_0206.jpg&contentType=image/jpeg'
  const response = await fetch(PRESIGNED_URL_ENDPOINT, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const message = await parseIdentifyError(response);
    throw new Error(
      message ?? 'Something went wrong while obtaining presigned URL.',
    );
  }
  const payload = await response.json();

  const uploadUrl = payload.url;

  return uploadUrl;
}

function ensureStorageConfigured(): void {
  if (storageConfigured) {
    return
  }

  Amplify.configure(
    {
      Storage: {
        S3: {
          bucket: STORAGE_BUCKET,
          region: STORAGE_REGION,
        },
      },
    },
  )

  storageConfigured = true
}

function buildStorageObjectKey(fileName: string): string {
  const extensionMatch = fileName.match(/\.([^.]+)$/)
  const extension = extensionMatch ? extensionMatch[0].toLowerCase() : '.jpg'
  const baseName = fileName
    .replace(/[^a-zA-Z0-9.\-_]+/g, '-')
    .replace(/\.+/g, '.')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .replace(/\.([^.]+)$/, '')

  const uniqueSuffix =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

  const sanitizedBase = baseName || 'plant-photo'
  return `${IDENTIFY_STORAGE_PREFIX}${uniqueSuffix}-${sanitizedBase}${extension}`
}

async function parseIdentifyError(response: Response): Promise<string | null> {
  try {
    const value = await response.json()

    if (typeof value === 'string') {
      return value
    }

    if (value?.message) {
      return value.message as string
    }

    return null
  } catch {
    return null
  }
}
