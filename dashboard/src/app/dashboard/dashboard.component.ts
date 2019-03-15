import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { UserStatus, Status } from '../models/symbols';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Map bots order by status.
  private static BOTS_ORDER_MAP = {
    REPORTED: 0,
    IN_PROCESS: 1,
    BOT: 2,
    NOT_BOT: 3
  };

  bots: UserStatus[] = [];
  filterString: string;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.retriveBotsToAnalyze();
  }

  /** Refresh all bots */
  async retriveBotsToAnalyze() {
    this.bots = (await this.data.getBotsToAnalyze().catch((error: HttpErrorResponse) => {
      this.onHttpError('Get bots fail', error);
    })) as UserStatus[];

    if (!this.bots) {
      this.bots = [];
      return;
    }

    // Sort bots by status and userid
    this.bots.sort((a: UserStatus, b: UserStatus) => {
      if (
        DashboardComponent.BOTS_ORDER_MAP[a.status] ===
        DashboardComponent.BOTS_ORDER_MAP[b.status]
      ) {
        return a.userId > b.userId ? 1 : -1;
      }

      return DashboardComponent.BOTS_ORDER_MAP[a.status] >
        DashboardComponent.BOTS_ORDER_MAP[b.status]
        ? 1
        : -1;
    });
  }

  /** Set bot status */
  setUserStatus(bot: UserStatus) {
    this.data.setStatus(bot).catch(error => {
      this.onHttpError('Set bot status fail', error);
    });
  }

  /** Filter bots by given string */
  primitiveFilter(bots: UserStatus[], filterString: string): UserStatus[] {
    /** If string empty return all */
    if (!filterString) {
      return bots;
    }

    const filterdBots: UserStatus[] = [];
    filterString = filterString.toLowerCase();
    for (const bot of bots) {
      /** Iterate on all bot properties */
      for (const botProperty of Object.values(bot)) {
        if (!botProperty) {
          continue;
        }

        let valueAsString;
        /** If propery is a abject/array convert it to string */
        if (typeof botProperty === 'object') {
          for (const propertyItem of botProperty) {
            if (propertyItem) {
              valueAsString += propertyItem;
            }
          }
        }

        /** the propery contance the filter string add to the bots array */
        if (
          (valueAsString && valueAsString.toLowerCase().indexOf(filterString) !== -1) ||
          (typeof botProperty === 'string' &&
            botProperty.toLowerCase().indexOf(filterString) !== -1)
        ) {
          filterdBots.push(bot);
          break;
        }
      }
    }

    return filterdBots;
  }

  /** Get bots array filterd by bot status */
  getBotsByStatus(status: Status): UserStatus[] {
    const filterdBots: UserStatus[] = [];
    for (const bot of this.bots) {
      if (bot.status === status) {
        filterdBots.push(bot);
      }
    }
    return filterdBots;
  }

  /** Generic ugly alert to fire when HTTP request failed. */
  private onHttpError(msg: string, error: HttpErrorResponse) {
    alert(`${msg}, ${error.statusText}, code ${error.status}.`);
  }
}
