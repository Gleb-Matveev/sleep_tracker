import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { parse } from 'pg-connection-string';

const configService = new ConfigService();
const databaseUrl = configService.get<string>('DATABASE_URL');

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const connectionOptions = parse(databaseUrl);

export const AppDataSource = new DataSource({
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
});
