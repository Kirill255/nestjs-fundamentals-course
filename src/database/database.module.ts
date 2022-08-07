import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';
import { CONNECTION } from './database.constant';

// @Module({
//   providers: [
//     {
//       provide: CONNECTION,
//       useValue: createConnection({
//         type: 'postgres',
//         host: 'localhost',
//         port: 5432,
//       }),
//     },
//   ],
// })

@Module({})
export class DatabaseModule {
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [{ provide: CONNECTION, useValue: createConnection(options) }],
    };
  }
}
