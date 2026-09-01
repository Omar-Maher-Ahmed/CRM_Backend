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
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';

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
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 7,
    }]),
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('DB Config', {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          database: config.get('DB_DATABASE'),
        });

        // console.log("✅ PostgreSQL Connected Successfully")
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
  providers: [AppService],
})


export class AppModule {
  constructor(private dataSource: DataSource) { }

  async onModuleInit() {
    await this.dataSource.query('SELECT NOW()');

    console.log('✅ PostgreSQL Connected Successfully!!');
  }
}
