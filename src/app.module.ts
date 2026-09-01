import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { DealStageModule } from './deal-stage/deal-stage.module';
import { DealModule } from './deal/deal.module';
import { ActivityModule } from './activity/activity.module';
import { SeederModule } from './seeder/seeder.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';
import { GraphQLError } from 'graphql';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    UserModule,
    AuthModule,
    RoleModule,
    CustomerModule,
    ProductModule,
    DealStageModule,
    DealModule,
    ActivityModule,
    SeederModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 7,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true,
      formatError: (error: GraphQLError) => {
        const originalError = error.extensions?.originalError as any;
        return {
          message: originalError?.message || error.message,
          statusCode: originalError?.statusCode || error.extensions?.statusCode || 500,
          errorType: (originalError?.statusCode === 404 ? 'NOT_FOUND' : (originalError?.statusCode === 400 ? 'BAD_REQUEST' : (error.extensions?.code || 'SERVER_ERROR'))),
          path: error.path,
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.getOrThrow('DB_HOST'),
          port: Number(config.getOrThrow('DB_PORT')),
          username: config.getOrThrow('DB_USERNAME'),
          password: config.getOrThrow('DB_PASSWORD'),
          database: config.getOrThrow('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }

  async onModuleInit() {
    await this.dataSource.query('SELECT NOW()');
    console.log('✅ PostgreSQL Connected Successfully!!');
  }
}
