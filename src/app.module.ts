import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './core/database/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { VoyageModule } from './voyage/voyage.module';
import { SkyscannerService } from './skyscanner/skyscanner.service';
import { HttpModule } from '@nestjs/axios';
import { TransportModule } from './transport/transport.module';
import { SkyscannerModule } from './skyscanner/skyscanner.module';
import { PixabayModule } from './pixabay/pixabay.module';
import { LogementModule } from './logement/logement.module';
import { ActiviteModule } from './activite/activite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, HttpModule, SkyscannerModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    VoyageModule,
    TransportModule,
    PixabayModule,
    LogementModule,
    ActiviteModule
  ],
})
export class AppModule {}
