<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).




### TIPS

> dto - Data Transfer Objects

описание типов данных, пока не понятно для чего отдельные папки для entities и dto, возможно в entities описываются типы данных которые исползуются внутри проекта, а в dto, типы данных которые передаются извне, с клиента

свойства в dto помечаются как readonly, чтобы нельзя было модифицировать то, что приходит с клиента

в CreateCoffeeDto все свойства обязательные, в UpdateCoffeeDto все свойства опциональные

> db

`npm install --save @nestjs/typeorm typeorm pg`

> https://discord.com/channels/520622812742811698/520649487924985885/945017429543772232
>
> Hi, what exactly does `transformOptions.enableImplicitConversion = true` option do?
> why transform: true not enough?
>
> from doc https://docs.nestjs.com/techniques/validation#transform-payload-objects
> `transform: true` can automatically transform payloads to be objects typed according to their DTO classes

`transform: true` tells Nest to return the newly created class instance from the pie. `enableImplicitConversion` tells `class-transformer` to look at the data from emitted from typescript's `emitDecoratorMetadata` flag to figure out what type a property should be, insteead of needing to use things like `@Type(() => Number)` or `@Transform(({ value }) => JSON.parse(value))` for booleans

> migrations

создать `ormconfig.js` с указанием полей entities, migrations, migrationsDir

с помощью typeorm cli и npx можно сгенерировать шаблон для миграции `npx typeorm migration:create -n CoffeRefactoring`

по пути `/src/migration/1645391244715-CoffeRefactoring.ts` будет создан шаблон миграции

```
import {MigrationInterface, QueryRunner} from "typeorm";

export class CoffeRefactoring1645391244715 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
```

написать миграцию

затем нужно запустить команду `npm run build`, будет сгенерированна папка dist, из которой typeorm cli при миграции возьмёт нужные ей файлы указанные в `ormconfig.js`

запуск миграции `npx typeorm migration:run`

откат мирграции `npx typeorm migration:revert`


можно сгенерировать миграцию из изменений в модели

меняем модель, например добавляем новый столбец

```
@Column({ nullable: true })
description: string;
```

генерируем новую папку dist `npm run build`

и запускаем генерацию миграции `npx typeorm migration:generate -n SchemaSync`

по итогу получим файл `/src/migration/1645393287586-SchemaSync.ts`

```
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaSync1645393287586 implements MigrationInterface {
  name = 'SchemaSync1645393287586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" ADD "description" character varying`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" DROP COLUMN "description"`,
      undefined,
    );
  }
}
```

## Other

https://courses.nestjs.com/

https://nestjs.com/

https://docs.nestjs.com/

https://nestjs.ru.com/

https://github.com/Freivincampbell/NestJS-Fundamentals-Course
