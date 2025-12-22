import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const connectionOptions = parse(databaseUrl);

  return {
    type: 'postgres',
    host: connectionOptions.host || 'localhost',
    port: parseInt(connectionOptions.port || '5432', 10),
    username: connectionOptions.user || 'postgres',
    password: connectionOptions.password || '',
    database: connectionOptions.database || 'my_site',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: true,
    ssl: { rejectUnauthorized: false },
    extra: {
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 20,
    },
  };
};
