export interface StockDataDto {
  symbol: string;
  currentPrice: number | undefined;
  movingAverage: number | string;
  lastUpdatedAt: Date | string;
}
