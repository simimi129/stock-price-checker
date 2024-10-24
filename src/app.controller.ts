import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { StockDataDto } from './domain/StockData.dto';

@Controller('stock')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':symbol')
  async getStockData(@Param('symbol') symbol: string): Promise<StockDataDto> {
    if (!isNaN(+symbol)) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Symbol cannot be a number' },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.appService.getStockData(symbol);
    } catch (error: any) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':symbol')
  async startPeriodicCheckForSymbol(
    @Param('symbol') symbol: string,
  ): Promise<string> {
    if (!isNaN(+symbol)) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Symbol cannot be a number' },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.appService.startPeriodicCheckForSymbol(symbol);
    } catch (error: any) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
