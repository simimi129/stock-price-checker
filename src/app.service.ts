import { Injectable } from '@nestjs/common';
import { FinnhubService } from './finnhub.service';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class AppService {
  constructor(
    private finnhubService: FinnhubService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  getStockData(symbol: string) {
    return this.finnhubService.getQuote(symbol);
  }

  startPeriodicCheckForSymbol(symbol: string) {
    const job = new CronJob(CronExpression.EVERY_SECOND, () => {});

    this.schedulerRegistry.addCronJob(`periodic-check-for-${symbol}`, job);
    job.start();
  }
}
