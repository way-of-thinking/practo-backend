import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      // ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev',
      ignoreEnvFile: process.env.NODE_ENV === 'test',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          }),
      synchronize: process.env.NODE_ENV !== 'production',
      logging:
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    CommonModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
