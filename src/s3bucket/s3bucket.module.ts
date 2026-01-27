import { Module } from '@nestjs/common';
import { S3bucketService } from './s3bucket.service';
import { S3bucketController } from './s3bucket.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [S3bucketController],
  providers: [S3bucketService],
  imports: [ConfigModule],
  exports: [S3bucketService]
})
export class S3bucketModule {}
