module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'testtesttest',
  database: 'nestjs-fundamentals-course',
  entities: ['dist/**/*.entity.js'],
  // migrationsTableName: 'CoffeRefactoring', // custom_migration_table
  migrations: ['dist/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration',
  },
};
