import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = this.config.get<string>('MINIO_ENDPOINT', 'minio:9000');
    const accessKeyId = this.config.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
    const secretAccessKey = this.config.get<string>('MINIO_SECRET_KEY', 'minioadmin');
    this.bucket = this.config.get<string>('MINIO_BUCKET', 'apartments');
    this.publicUrl = this.config.get<string>('MINIO_PUBLIC_URL', 'http://localhost:9000');

    this.client = new S3Client({
      endpoint: `http://${endpoint}`,
      region: 'us-east-1',
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    await this.ensureBucket();
  }

  // Checks whether the target bucket exists on startup and creates it (with a
  // public-read policy) if it doesn't, so a fresh MinIO volume works out of the box.
  private async ensureBucket() {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Bucket "${this.bucket}" already exists`);
    } catch (err) {
      this.logger.log(`Bucket "${this.bucket}" not found, creating it`);
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
      await this.setPublicReadPolicy();
    }
  }

  private async setPublicReadPolicy() {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucket}/*`],
        },
      ],
    };
    await this.client.send(
      new PutBucketPolicyCommand({
        Bucket: this.bucket,
        Policy: JSON.stringify(policy),
      }),
    );
    this.logger.log(`Set public-read policy on bucket "${this.bucket}"`);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const extension = file.originalname.includes('.')
      ? file.originalname.slice(file.originalname.lastIndexOf('.'))
      : '';
    const key = `${uuidv4()}${extension}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // Built with MINIO_PUBLIC_URL (not the internal endpoint) because this URL
    // is rendered in <img src> and must be resolvable from the reviewer's browser.
    return `${this.publicUrl}/${this.bucket}/${key}`;
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.uploadFile(file)));
  }
}
