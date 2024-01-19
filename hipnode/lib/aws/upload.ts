import S3 from "aws-sdk/clients/s3";

export const uploadImageToS3 = async (file: File) => {
  if (!file) return;

  const s3 = new S3({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY!,
    },
  });

  return new Promise<S3.ManagedUpload.SendData>((resolve, reject) => {
    s3.upload(
      {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file.name,
        Body: file,
        ContentType: file.type,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};
