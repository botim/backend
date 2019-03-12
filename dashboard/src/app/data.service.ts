import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bot } from './models/symbols';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  /**
   * Set bot status.
   * @param bot bot with an updated status property.
   */
  async setStatus(bot: Bot) {
    await this.http
      .put(`/bots/${bot.platform}/${bot.userId}`, { setStatus: bot.status })
      .toPromise();
  }

  /**
   * Get *all* bots in system.
   */
  async getBotsToAnalyze(): Promise<Bot[]> {
    return await this.http.get<Bot[]>('/bots').toPromise();
  }
}
