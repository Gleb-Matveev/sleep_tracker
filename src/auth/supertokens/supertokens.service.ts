import { Inject, Injectable } from '@nestjs/common';
import supertokens, { RecipeUserId } from 'supertokens-node';
import type { TypeInput } from 'supertokens-node/types';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject('SUPERTOKEN-CONFIG')
    private config: TypeInput,
  ) {
    supertokens.init(this.config);
  }

  async createUser(email: string, password: string) {
    return await EmailPassword.signUp('public', email, password);
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
