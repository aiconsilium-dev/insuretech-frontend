import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  User,
  Complex,
  Policy,
  Claim,
  ClaimPhoto,
  ClaimAiReason,
  ClaimPrecedent,
  ClaimEvent,
  TypeADetail,
  TypeBDetail,
  Estimation,
  EstimationItem,
  Document,
  Approval,
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'user'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_DATABASE', 'insuretech'),
        entities: [
          User,
          Complex,
          Policy,
          Claim,
          ClaimPhoto,
          ClaimAiReason,
          ClaimPrecedent,
          ClaimEvent,
          TypeADetail,
          TypeBDetail,
          Estimation,
          EstimationItem,
          Document,
          Approval,
        ],
        migrations: [__dirname + '/migrations/*.{ts,js}'],
        synchronize: false,
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
