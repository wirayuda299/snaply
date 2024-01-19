import S3 from "aws-sdk/clients/s3";

export default  class FileuploadController {

    private readonly AWS_REGION:string = process.env.AWS_S3_REGION!;
    private readonly AWS_BUCKET_NAME:string = process.env.BUCKET_NAME!
    private readonly AWS_ACCESS_ID:string = process.env.AWS_ACCESS_ID!
    private readonly AWS_ACCESS_KEY:string = process.env.AWS_SECRET_KEY!


    async uploadImageToS3(file:File){
        try {
            const s3 = new S3({
                region: this.AWS_REGION,
                credentials: {
                    accessKeyId: this.AWS_ACCESS_ID,
                    secretAccessKey: this.AWS_ACCESS_KEY,
                },
            });


            return new Promise<S3.ManagedUpload.SendData>((resolve, reject) => {
                s3.upload(
                    {
                        Bucket: this.AWS_BUCKET_NAME,
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

        }catch (e){
            throw e

        }
    }







}