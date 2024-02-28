import { DataSource, DataSourceOptions } from 'typeorm';

const settings = (): DataSourceOptions => {
  const nodeEnv: string | undefined = process.env.NODE_ENV;

  if (nodeEnv === 'test') {
    return {
      type: 'sqlite',
      database: 'db.test.sqlite',
      synchronize: true,
      entities: ['**/*.entity.{js,ts}'],
    };
  } else if (nodeEnv === 'development') {
    return {
      type: 'sqlite',
      database: 'db.dev.sqlite',
      synchronize: true,
      entities: ['**/*.entity.{js,ts}'],
    };
  } else if (nodeEnv === 'production') {
    const dbUrl: string | undefined = process.env.DATABASE_URL;

    if (!dbUrl) throw new Error("Missing env var: 'DATABASE_URL'");

    return {
      type: 'postgres',
      url: dbUrl,
      logging: true,
      entities: ['**/*.entity.{js,ts}'],
      migrations: [__dirname + './migrations/**.{ts,js}'],
      synchronize: false,
    };
  }
};

const appDataSource = new DataSource(settings());

export { appDataSource };

// export const appDataSource = new DataSource({
//   type: 'sqlite',
//   database: 'db.dev.sqlite',
//   entities: ['**/*.entity{.js,.ts}'],
//   migrations: [__dirname + '/migrations/*{.js,.ts}'],
// } as DataSourceOptions);
