// File-upload pipeline for the chat composer.
//
// Supports BOTH picker libraries so the SDK works in either setup:
//   - Expo (managed / Expo Go) -> `expo-image-picker`
//   - bare React Native         -> `react-native-image-picker`
// Both are optional and resolved lazily, so the composer degrades gracefully
// (the attach button hides) when neither is installed. The uploaded file key is
// returned and sent as a message attachment via the existing
// `widgetsInsertMessage` mutation (which already accepts attachments).
//
// NOTE: the upload endpoint mirrors the web uploader:
// `POST /upload-file?kind=main&maxHeight=0&maxWidth=0`.

export type PickedFile = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

export type UploadedAttachment = {
  url: string;
  name: string;
  type: string;
  size?: number;
};

export type UploadResponseType = 'text' | 'json';

export type UploadOptions = {
  url?: string;
  kind?: string;
  userId?: string;
  responseType?: UploadResponseType;
  maxHeight?: number;
  maxWidth?: number;
  extraFormData?: Array<{ key: string; value: string }>;
};

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export const unsupportedImageUploadMessage =
  'Only PNG and JPG images can be uploaded.';

const getCleanPath = (value?: string | null): string => {
  const withoutQuery = (value || '').split('?')[0] || '';

  return withoutQuery.split('#')[0] || '';
};

const getExtension = (value?: string | null): string => {
  const match = getCleanPath(value).match(/\.([a-zA-Z0-9]+)$/);

  return match && match[1] ? match[1].toLowerCase() : '';
};

const normalizeMimeType = (type?: string | null): string => {
  if (!type) {
    return '';
  }

  return type === 'image/jpg' ? 'image/jpeg' : type.toLowerCase();
};

const getMimeTypeFromExtension = (extension: string): string => {
  if (extension === 'jpg' || extension === 'jpeg') {
    return 'image/jpeg';
  }

  if (extension === 'png') {
    return 'image/png';
  }

  return '';
};

const getFileNameFromUri = (uri?: string | null): string => {
  const fileName = getCleanPath(uri).split('/').pop() || '';

  return getExtension(fileName) ? fileName : '';
};

const getImageFileName = (
  fileName?: string | null,
  uri?: string | null,
  type?: string | null
): string => {
  if (fileName && getExtension(fileName)) {
    return fileName;
  }

  const uriFileName = getFileNameFromUri(uri);
  if (uriFileName) {
    return uriFileName;
  }

  const normalizedType = normalizeMimeType(type);
  let extension = 'unsupported';

  if (normalizedType === 'image/png') {
    extension = 'png';
  }

  if (normalizedType === 'image/jpeg') {
    extension = 'jpg';
  }

  return `image-${Date.now()}.${extension}`;
};

const getImageMimeType = (
  type?: string | null,
  fileName?: string | null,
  uri?: string | null
): string => {
  const normalizedType = normalizeMimeType(type);

  return (
    normalizedType ||
    getMimeTypeFromExtension(getExtension(fileName)) ||
    getMimeTypeFromExtension(getExtension(uri))
  );
};

export const isAllowedImageFile = (file: PickedFile): boolean => {
  const type = normalizeMimeType(file.type);

  if (type) {
    return ALLOWED_IMAGE_MIME_TYPES.includes(type);
  }

  const extension = getExtension(file.name) || getExtension(file.uri);

  return ALLOWED_IMAGE_EXTENSIONS.includes(extension);
};

// NOTE: each require must be a LITERAL string inside try/catch so Metro treats
// it as an OPTIONAL dependency — it is bundled when installed and skipped
// (without failing the build) when absent. A variable require would never be
// bundled. Expo is preferred when present (works in Expo Go without a rebuild).
const getExpoPicker = (): any | null => {
  try {
    return require('expo-image-picker');
  } catch {
    return null;
  }
};

const getRNPicker = (): any | null => {
  try {
    return require('react-native-image-picker');
  } catch {
    return null;
  }
};

export const isImagePickerAvailable = (): boolean =>
  !!(
    getExpoPicker()?.launchImageLibraryAsync ||
    getRNPicker()?.launchImageLibrary
  );

export const pickImage = async (): Promise<PickedFile | null> => {
  const expo = getExpoPicker();
  if (expo?.launchImageLibraryAsync) {
    if (expo.requestMediaLibraryPermissionsAsync) {
      const perm = await expo.requestMediaLibraryPermissionsAsync();
      if (perm && perm.granted === false) {
        return null;
      }
    }
    // `MediaType` is a TS-only type in expo-image-picker v16+; the runtime value
    // is the string-array form. Using it avoids the deprecated
    // `MediaTypeOptions` (and its warning).
    const result = await expo.launchImageLibraryAsync({
      mediaTypes: ['images'],
      preferredAssetRepresentationMode:
        expo.UIImagePickerPreferredAssetRepresentationMode?.Compatible ||
        'compatible',
      quality: 0.8,
    });
    if (result?.canceled || !result?.assets || result.assets.length === 0) {
      return null;
    }
    const asset = result.assets[0];
    const name = getImageFileName(asset.fileName, asset.uri, asset.mimeType);
    return {
      uri: asset.uri,
      name,
      type: getImageMimeType(asset.mimeType, name, asset.uri),
      size: asset.fileSize,
    };
  }

  const rn = getRNPicker();
  if (rn?.launchImageLibrary) {
    const result = await rn.launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      assetRepresentationMode: 'compatible',
      quality: 0.8,
    });
    if (result?.didCancel || !result?.assets || result.assets.length === 0) {
      return null;
    }
    const asset = result.assets[0];
    const name = getImageFileName(asset.fileName, asset.uri, asset.type);
    return {
      uri: asset.uri,
      name,
      type: getImageMimeType(asset.type, name, asset.uri),
      size: asset.fileSize,
    };
  }

  return null;
};

const getFileType = (file: PickedFile): string => {
  return getImageMimeType(file.type, file.name, file.uri);
};

const normalizeUploadResponse = (
  response: unknown,
  responseType: UploadResponseType
): string => {
  if (responseType === 'text') {
    return String(response).trim();
  }

  if (typeof response === 'string') {
    return response.trim();
  }

  if (response && typeof response === 'object') {
    const body = response as Record<string, any>;
    return String(
      body.url || body.key || body.name || body.response || body.file || ''
    ).trim();
  }

  return '';
};

// erxes gateway upload endpoint. erxes core serves file routes at the gateway
// root: `GET /read-file` (download, see getAttachmentUrl) and `POST
// /upload-file` (upload), which returns the stored file key as plain text.
export const getUploadUrl = (
  subDomain: string,
  options: UploadOptions = {}
): string => {
  const {
    url = `https://${subDomain}/gateway/upload-file`,
    kind = 'main',
    maxHeight = 0,
    maxWidth = 0,
  } = options;

  const separator = url.includes('?') ? '&' : '?';

  return `${url}${separator}kind=${encodeURIComponent(
    kind
  )}&maxHeight=${maxHeight}&maxWidth=${maxWidth}`;
};

export const uploadFile = async (
  file: PickedFile,
  subDomain: string,
  options: UploadOptions = {}
): Promise<UploadedAttachment> => {
  const type = getFileType(file);
  const uploadFileInfo = {
    ...file,
    name: getImageFileName(file.name, file.uri, type),
    type,
  };

  if (!isAllowedImageFile(uploadFileInfo)) {
    throw new Error(unsupportedImageUploadMessage);
  }

  const form = new FormData();
  form.append('file', {
    uri: uploadFileInfo.uri,
    name: uploadFileInfo.name,
    type: uploadFileInfo.type,
  } as any);

  if (options.extraFormData) {
    options.extraFormData.forEach(({ key, value }) => {
      form.append(key, value);
    });
  }

  const responseType = options.responseType || 'text';
  const response = await fetch(getUploadUrl(subDomain, options), {
    method: 'POST',
    body: form,
    credentials: 'include',
    ...(options.userId ? { headers: { userId: options.userId } } : {}),
  });

  const responseBody = await response[responseType]();

  if (!response.ok) {
    const detail =
      typeof responseBody === 'string'
        ? responseBody.slice(0, 200)
        : JSON.stringify(responseBody).slice(0, 200);
    throw new Error(`Upload failed (${response.status}) ${detail}`.trim());
  }

  const key = normalizeUploadResponse(responseBody, responseType);

  if (!key) {
    throw new Error('Upload failed: empty file key');
  }

  return {
    url: key,
    name: uploadFileInfo.name,
    type: uploadFileInfo.type,
    size: uploadFileInfo.size,
  };
};
