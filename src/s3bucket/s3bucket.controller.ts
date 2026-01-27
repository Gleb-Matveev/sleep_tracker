import { Body, Controller, Get, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { S3bucketService } from './s3bucket.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SampleDto } from './sample.dto';

@Controller('s3bucket')
export class S3bucketController {
  constructor(private readonly s3bucketService: S3bucketService) {}

  @Get('upload/text')
  @Render('upload_test')
  async uploadText() {
    const text = await this.s3bucketService.getText();

    return {
      upload: true,
      text: text
    };
  }

  @Get()
  @Render('upload_test')
  async uploadPic() {
    const url = await this.s3bucketService.getPresignedImageUrl('w15.jpg');

    //console.log("Url:", url);
    return {
      upload: true,
      imageUrl: url
    };
  }
  
  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  async uploadFile(
    @Body() body: SampleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    //console.log("Here");
    //console.log("File:", file);

    const res = await this.s3bucketService.saveImage(file);

    return {
      uploaded: res
    };
  }
}
