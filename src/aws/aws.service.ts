import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    const awsS3Region = this.configService.get<string>('AWS_S3_REGION');
    const awsAccessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    AWS.config.update({ region: awsS3Region });

    this.s3 = new AWS.S3({
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<AWS.S3.ManagedUpload.SendData> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const { originalname, buffer, mimetype } = file;

    const uploadParams = {
      Bucket: bucketName,
      Key: `${Date.now().toString()}-${originalname}`,
      Body: buffer,
      ACL: 'public-read',
      ContentType: mimetype,
    };

    return this.s3.upload(uploadParams).promise();
  }

  async deleteFile(key: string): Promise<void> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const deleteParams = {
      Bucket: bucketName,
      Key: key,
    };
  
    await this.s3.deleteObject(deleteParams).promise();
  }

  getFileUrl(key: string): string {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  }

  async getAllFiles(prefix?: string): Promise<AWS.S3.ListObjectsV2Output> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const listParams = {
      Bucket: bucketName,
      Prefix: prefix,
    };
  
    return this.s3.listObjectsV2(listParams).promise();
  }
}
