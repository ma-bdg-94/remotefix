import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { DataSource } from 'typeorm';
import { Accounts } from './accounts/accounts.entity';
import { AddressesModule } from './addresses/addresses.module';
import { Addresses } from './addresses/addresses.entity';
import { CountriesModule } from './countries/countries.module';
import { Countries } from './countries/countries.entity';
import { CurrenciesModule } from './currencies/currencies.module';
import { Currencies } from './currencies/currencies.entity';
import { IndustriesModule } from './industries/industries.module';
import { Industries } from './industries/industries.entity';
import { MenuItemsModule } from './menu_items/menu_items.module';
import { MenuItems } from './menu_items/menu_items.entity';
import { RegistriesModule } from './registries/registries.module';
import { Registries } from './registries/registries.entity';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomExceptionFilter } from './config/filters/custom-exception.filter';
import { SuccessResponseInterceptor } from './config/interceptors/success_response.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '../.env'),
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        isGlobal: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: parseInt(configService.get('POSTGRES_PORT'), 10),
        username: configService.get('POSTGRES_USERNAME'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          Accounts,
          Addresses,
          Countries,
          Currencies,
          Industries,
          MenuItems,
          Registries,
        ],
        synchronize: true,
      }),
    }),
    AccountsModule,
    AddressesModule,
    CountriesModule,
    CurrenciesModule,
    IndustriesModule,
    MenuItemsModule,
    RegistriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
