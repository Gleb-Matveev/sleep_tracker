import { Body, Controller, Get, Post, Render, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { S3bucketService } from './s3bucket.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('s3bucket')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
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
    console.log("Some");
    //const url = await this.s3bucketService.getPresignedImageUrl('w15.jpg');
    const url = await this.s3bucketService.getConstImageUrl();

    return {
      upload: true,
      imageUrl: url
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.s3bucketService.saveImage(file);

    return;
  }
}
