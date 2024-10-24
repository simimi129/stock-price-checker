import { Injectable } from '@nestjs/common';
import { FinnhubService } from './third-party-apis/finnhub.service';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Repository } from 'typeorm';
import { Stock } from './domain/Stock.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StockDataDto } from './domain/StockData.dto';

@Injectable()
export class AppService {
  constructor(
    private finnhubService: FinnhubService,
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async getStockData(symbol: string): Promise<StockDataDto> {
    const stocks: Stock[] = await this.stockRepository.query(
      `SELECT * FROM stock WHERE symbol='${symbol}' ORDER BY id DESC LIMIT 10;`,
    );
    let movingAverage;
    if (stocks.length === 10) {
      movingAverage = this.calculateMovingAverage(stocks);
    }
    const { c } = await this.finnhubService.getQuote(symbol);
    if (c === 0) {
      throw 'no stock with given name';
    }
    return {
      symbol,
      currentPrice: c,
      movingAverage: movingAverage ? movingAverage : 'not enough stock data',
      lastUpdatedAt: stocks.length
        ? stocks[0].createdAt
        : 'no stock data in db',
    };
  }

  calculateMovingAverage(stocks: Stock[], numberOfDataPoints = 10): number {
    let sumOfClosedStockPrices: number = 0;
    for (const { previousClosePrice } of stocks) {
      if (previousClosePrice) sumOfClosedStockPrices += +previousClosePrice;
    }
    const sma = sumOfClosedStockPrices / numberOfDataPoints;
    return sma;
  }

  async startPeriodicCheckForSymbol(symbol: string) {
    const { c, pc } = await this.finnhubService.getQuote(symbol);
    if (c === 0) {
      throw 'no stock with given name';
    }
    const job = new CronJob(CronExpression.EVERY_MINUTE, () =>
      this.getQuoteAndSave(symbol, c, pc),
    );
    this.schedulerRegistry.addCronJob(`periodic-check-for-${symbol}`, job);
    job.start();
    return `peridoic check for stock ${symbol} started look at the console for at least a minute :)`;
  }

  async getQuoteAndSave(
    symbol: string,
    currentPrice: number | undefined,
    previousClosePrice: number | undefined,
  ) {
    const stock: Partial<Stock> = {
      symbol,
      currentPrice,
      previousClosePrice,
    };
    await this.stockRepository.save(stock as Partial<Stock>);
    console.log(`periodic check for ${symbol}`);
  }
}
