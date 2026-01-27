import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { readFileSync } from 'fs';

@Injectable()
export class S3bucketService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    @Inject()
    private readonly configService: ConfigService,
  ) {
    this.bucketName =
      this.configService.get<string>('YANDEX_BUCKET_NAME') || 'glebsite';

    const endpoint =
      this.configService.get<string>('YANDEX_ENDPOINT') ||
      'https://storage.yandexcloud.net';
    const accessKeyId =
      this.configService.get<string>('YANDEX_ACCESS_KEY_ID') || '';
    const secretAccessKey =
      this.configService.get<string>('YANDEX_SECRET_ACCESS_KEY') || '';

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('Yandex Object Storage credentials are not configured');
    }

    this.s3Client = new S3Client({
      region: 'ru-central1',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async getText() {
    console.log('Getting your "bucket-text" object');
    const { Body } = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: 'a.txt',
      }),
    );
    if (!Body) {
      console.log("Couldn't find the object");
      return '';
    }

    return await Body.transformToString();
  }

  async getPresignedImageUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  getConstImageUrl(): string {
    return "https://glebsite.storage.yandexcloud.net/root.png";
  }

  async saveImage(file: Express.Multer.File): Promise<string | undefined> {
    const putCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    });

    const res = await this.s3Client.send(putCommand);

    if (res.$metadata.httpStatusCode !== 200) 
    {
        return;
    }

    return `https://glebsite.storage.yandexcloud.net/${file.originalname}`;
  }
}
