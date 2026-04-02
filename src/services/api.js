const versionsApiUrl =
  import.meta.env.VITE_FILE_VERSIONS_API_URL ||
  'https://qy24yh6f5agfo6hm75dsukdvji0wfztb.lambda-url.eu-north-1.on.aws/';

export function isVersionsApiConfigured() {
  return Boolean(versionsApiUrl);
}

export async function listFileVersions(filePath) {
  if (!versionsApiUrl) {
    throw new Error('versions api is not configured yet');
  }

  const requestUrl = new URL(versionsApiUrl);

  requestUrl.searchParams.set('filePath', filePath);

  const response = await fetch(requestUrl.toString(), {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('unable to load file versions');
  }

  const payload = await response.json();

  return payload.versions || [];
}
