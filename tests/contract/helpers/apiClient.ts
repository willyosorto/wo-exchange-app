import axios, { AxiosResponse } from 'axios';

export interface ExchangeRateResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
  conversion_result: number;
}

export interface ExchangeRateErrorResponse {
  result: string;
  'error-type': string;
}

export class ExchangeApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async getExchangeRate(
    from: string,
    to: string,
    amount: number
  ): Promise<AxiosResponse<ExchangeRateResponse>> {
    const url = `${this.baseUrl}/pair/${from}/${to}/${amount}`;
    
    const headers = this.apiKey 
      ? { Authorization: `Bearer ${this.apiKey}` }
      : {};

    return axios.get<ExchangeRateResponse>(url, { 
      headers,
      validateStatus: () => true // Accept any status code
    });
  }
}
