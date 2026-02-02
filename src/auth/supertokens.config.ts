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

function isBrowserDocumentRequest(req: any): boolean {
  const accept = String(req.headers?.accept ?? '');
  const secFetchDest = String(req.headers?.['sec-fetch-dest'] ?? '');
  return accept.includes('text/html') || secFetchDest === 'document';
}

function isGraphQLRequest(req: any): boolean {
  const url = String(req.originalUrl ?? req.url ?? '');
  if (url.startsWith('/graphql')) return true;

  const body = req.body;
  return !!(body && (typeof body.query === 'string' || typeof body.operationName === 'string'));
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
