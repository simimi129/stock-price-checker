import { Controller, Get, Param, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { Quote } from 'finnhub-ts';

@Controller('stock')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':symbol')
  getStockData(@Param('symbol') symbol: string) {
    return this.appService.getStockData(symbol);
  }

  @Put(':symbol')
  startPeriodicCheckForSymbol(@Param('symbol') symbol: string) {
    return this.appService.startPeriodicCheckForSymbol(symbol);
  }
}
