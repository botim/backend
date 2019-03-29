import { PAGINATION_ITEMS_PER_PAGE } from '../core/config';

// TODO: currently, can't be generic because of tsoa (hence the any[])
export class Pagination {
  public perPage: number;

  constructor(public items: any[], public total: number) {
    this.perPage = PAGINATION_ITEMS_PER_PAGE;
  }
}
