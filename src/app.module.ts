import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config.shema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('TYPEORM_HOST'),
          database: configService.get('TYPEORM_DATABASE'),
          username: configService.get('TYPEORM_USERNAME'),
          password: configService.get('TYPEORM_PASSWORD'),
          port: parseInt(configService.get('TYPEORM_PORT'), 10),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
