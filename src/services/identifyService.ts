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

export type PresignedUrlResponse = {
  url: string,
  key: string
}

export const IDENTIFY_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/pjpeg']

export const IDENTIFY_MAX_FILE_SIZE_MB = 8
export const IDENTIFY_MAX_FILE_SIZE_BYTES =
  IDENTIFY_MAX_FILE_SIZE_MB * 1024 * 1024

export async function identifyPlantFromImage(
  file: File,
): Promise<PlantIdentification> {
  try {
    const presignedUrl = await getPresignedUrlForImageUpload(file.name);

    await uploadImageToStorage(file, presignedUrl.url);

    const result = await identifyPlantUsingUploadedImage(presignedUrl.key)

    return result;
  } catch (error) {
    console.error('Error identifying plant:', error)
    throw new Error('Failed to identify plant')
  }
}

async function getPresignedUrlForImageUpload(fileName: string): Promise<PresignedUrlResponse> {
  const PRESIGNED_URL_ENDPOINT = `${ import.meta.env.VITE_API_URL }/get-upload-url?filename=${fileName}&contentType=image/jpeg`
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
  if (import.meta.env.VITE_STAGE === 'local') {
    const localstackUrl = payload.url.split('4566')[1];
    console.log('Localstack URL:', localstackUrl);
    return { url: localstackUrl, key: payload.key };
  }
  return payload;
}

async function uploadImageToStorage(
  file: File,
  url: string
): Promise<void> {
  await fetch(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
}

async function identifyPlantUsingUploadedImage(
  fileName: string,
): Promise<PlantIdentification> {
  const IDENTIFY_PLANT_ENDPOINT = `${ import.meta.env.VITE_API_URL }/identify`
  const response = await fetch(IDENTIFY_PLANT_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ plant: fileName }),
  })

  if (!response.ok) {
    const message = await parseIdentifyError(response)
    throw new Error(
      message ?? 'Something went wrong while identifying the plant.',
    )
  }

  const data: PlantIdentificationResponse = await response.json();

  if (data.result?.plant) {
    return data.result.plant
  } else {
    throw new Error('No plant identified in the response.');
  }
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
