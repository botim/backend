import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStatus, Status } from './models/symbols';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  /**
   * Set bot status.
   * @param user bot with an updated status property.
   */
  async setStatus(user: UserStatus) {
    await this.http
      .put(`/users/${user.platform}/${user.userId}`, { setStatus: user.status })
      .toPromise();
  }

  /**
   * Get *all* bots in system.
   */
  async getBotsToAnalyze(): Promise<UserStatus[]> {
    const rawUsers = await this.http.get<UserStatus[]>('/users').toPromise();

    const users: UserStatus[] = [];
    const duplicates: UserStatus[] = [];

    /** Seperate reports to users and duplicates */
    for (const user of rawUsers) {
      if (user.status === Status.DUPLICATE) {
        duplicates.push(user);
      } else {
        user.duplicates = [];
        users.push(user);
      }
    }

    /** Put each duplicate report in correct user duplicates property */
    for (const duplicateReport of duplicates) {
      for (const user of users) {
        if (
          user.platform === duplicateReport.platform &&
          user.userId === duplicateReport.userId
        ) {
          user.duplicates.push(duplicateReport);
          break;
        }
      }
    }

    return users;
  }
}
