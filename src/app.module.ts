import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FinnhubService } from './third-party-apis/finnhub.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './domain/Stock.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Stock],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Stock]),
  ],
  controllers: [AppController],
  providers: [AppService, FinnhubService],
})
export class AppModule {}
