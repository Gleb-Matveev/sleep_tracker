import { Inject, Injectable } from '@nestjs/common';
import supertokens, { RecipeUserId } from 'supertokens-node';
import type { TypeInput } from 'supertokens-node/types';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRole } from 'src/user/entities/user.entity';
import { S3bucketService } from 'src/s3bucket/s3bucket.service';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject('SUPERTOKEN-CONFIG')
    private config: TypeInput,
    private readonly userService: UserService,
    private readonly s3bucketService: S3bucketService
  ) {
    supertokens.init(this.config);
  }

  async createUser(
    email: string,
    password: string,
    file: Express.Multer.File,
  ) {
    const res = await EmailPassword.signUp('public', email, password);
    if (res.status == 'OK') {
      const url = await this.s3bucketService.saveImage(file) || '';

       const createUserDto: CreateUserDto = {
          supertoken_id: res.user.id,
          email: res.user.emails[0],
          avatar_url: url,
          role: UserRole.USER
       }
       this.userService.create(createUserDto);
    }
    return res.status;
  }

  async signIn(email: string, password: string) {
    return await EmailPassword.signIn('public', email, password);
  }

  async signOut(sessionHandle: string) {
    return await Session.revokeSession(sessionHandle);
  }

  async createSession(req: any, res: any, recipeUserId: RecipeUserId) {
    return await Session.createNewSession(req, res, 'public', recipeUserId);
  }

  async getSession(req: any, res: any) {
    return await Session.getSession(req, res, {
      antiCsrfCheck: true,
    });
  }
}
