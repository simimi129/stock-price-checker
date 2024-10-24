import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DefaultApi } from 'finnhub-ts';

@Injectable()
export class FinnhubService {
  finnhubClient: DefaultApi;

  constructor(private configService: ConfigService) {
    this.finnhubClient = new DefaultApi({
      apiKey: configService.get('API_KEY'),
      isJsonMime: (input) => {
        try {
          JSON.parse(input);
          return true;
        } catch (error) {}
        return false;
      },
    });
  }

  async getQuote(symbol: string) {
    return (await this.finnhubClient.quote(symbol)).data;
  }
}
