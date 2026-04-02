
const { S3Client, ListObjectVersionsCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const s3Client = new S3Client({ region: process.env.STORAGE_BUCKET_REGION })

function formatVersionLabel(versionIndex, version) {
  if (version.IsLatest) {
    return 'latest version'
  }

  return `version ${versionIndex + 1}`
}

exports.handler = async (event) => {
  const filePath = event.queryStringParameters?.filePath

  if (!filePath) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'filePath is required',
      }),
    }
  }

  const listResponse = await s3Client.send(
    new ListObjectVersionsCommand({
      Bucket: process.env.STORAGE_BUCKET_NAME,
      Prefix: filePath,
    })
  )

  const versions = await Promise.all(
    (listResponse.Versions || [])
      .filter((version) => version.Key === filePath)
      .sort((leftVersion, rightVersion) => {
        const leftDate = leftVersion.LastModified ? new Date(leftVersion.LastModified).getTime() : 0
        const rightDate = rightVersion.LastModified ? new Date(rightVersion.LastModified).getTime() : 0

        return rightDate - leftDate
      })
      .map(async (version, versionIndex) => {
        const signedUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.STORAGE_BUCKET_NAME,
            Key: version.Key,
            VersionId: version.VersionId,
          }),
          { expiresIn: 900 }
        )

        return {
          versionId: version.VersionId,
          isLatest: Boolean(version.IsLatest),
          label: formatVersionLabel(versionIndex, version),
          lastModified: version.LastModified ? new Date(version.LastModified).toLocaleString('en-US') : 'unknown date',
          size: version.Size || 0,
          url: signedUrl,
        }
      })
  )

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      versions,
    }),
  }
}
