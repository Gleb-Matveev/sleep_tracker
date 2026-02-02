import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import UserRoles from 'supertokens-node/recipe/userroles';
import { TypeInput } from 'supertokens-node/types';

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is missing`);
  }
  return value;
}

export const supertokensConfig = (): TypeInput => ({
  appInfo: {
    appName: requireEnv('SUPERTOKENS_APP_NAME'),
    apiDomain: requireEnv('SUPERTOKENS_API_DOMAIN'),
    websiteDomain: requireEnv('SUPERTOKENS_WEBSITE_DOMAIN'),
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
  },
  supertokens: {
    connectionURI: requireEnv('SUPERTOKENS_CONNECTION_URI'),
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  recipeList: [
    EmailPassword.init({
      signUpFeature: {
        formFields: [
          {
            id: 'email',
            optional: false,
          },
          {
            id: 'password',
            optional: false,
          },
        ],
      },
    }),
    Session.init({
      getTokenTransferMethod: () => 'cookie',
    }),
  ],
});
