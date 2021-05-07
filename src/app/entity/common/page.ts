export class PageResult<T> {
  total: number;
  data: T[];
}

export class PageRequest {

  constructor(page: number, size: number, sort: string, order: string) {
    this.page = page;
    this.size = size;
    this.sort = sort;
    this.order = order;
  }

  page = 1;
  size = 10;
  sort: string;
  order: string;
}
