import { getUrl, list, remove, uploadData } from 'aws-amplify/storage';
import awsExports from '../aws-exports';

const filesPrefix = 'files/';

export const isStorageConfigured = Boolean(
  awsExports.aws_user_files_s3_bucket &&
  awsExports.aws_user_files_s3_bucket_region
);

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
}

function formatStoredName(filePath) {
  const rawName = filePath.split('/').pop() || '';
  return rawName.replace(/^\d+-/, '');
}

export async function uploadFile(file) {
  if (!isStorageConfigured) {
    throw new Error('s3 storage is not configured yet');
  }

  const safeName = sanitizeFileName(file.name);
  const storedName = `${Date.now()}-${safeName}`;

  // this keeps every user inside their own private s3 folder
  const uploadTask = uploadData({
    path: ({ identityId }) => `private/${identityId}/${filesPrefix}${storedName}`,
    data: file,
    options: {
      contentType: file.type || 'application/octet-stream',
    },
  });

  const result = await uploadTask.result;

  return {
    path: result.path,
    name: safeName,
  };
}

export async function listFiles() {
  if (!isStorageConfigured) {
    return [];
  }

  // purpose of this is to fetch only the signed-in user's uploaded files
  const response = await list({
    path: ({ identityId }) => `private/${identityId}/${filesPrefix}`,
    options: {
      listAll: true,
    },
  });

  const files = await Promise.all(
    response.items.map(async (item) => {
      // purpose of this is to let the dashboard open and download files from private storage
      const urlResult = await getUrl({
        path: item.path,
        options: {
          expiresIn: 900,
          validateObjectExistence: false,
        },
      });

      return {
        path: item.path,
        name: formatStoredName(item.path),
        size: item.size || 0,
        lastModified: item.lastModified || null,
        url: urlResult.url.toString(),
      };
    })
  );

  return files.sort((leftFile, rightFile) => {
    const leftDate = leftFile.lastModified ? new Date(leftFile.lastModified).getTime() : 0;
    const rightDate = rightFile.lastModified ? new Date(rightFile.lastModified).getTime() : 0;

    return rightDate - leftDate;
  });
}

export async function deleteFile(filePath) {
  if (!isStorageConfigured) {
    throw new Error('s3 storage is not configured yet');
  }

  // purpose of this is to remove a file from the signed-in user's private storage area
  await remove({
    path: filePath,
  });
}
