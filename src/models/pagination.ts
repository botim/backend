import { ITEMS_PER_PAGE } from '../core/config';

import { UserStatus } from './user-status.model';

export class Pagination {
  public itemsPerPage: number;

  constructor(public userStatuses: UserStatus[], public total: number) {
    this.itemsPerPage = ITEMS_PER_PAGE;
  }
}
