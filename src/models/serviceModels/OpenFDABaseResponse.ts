export interface OpenFDABaseResponse {
  meta: {
    last_updated: Date;
    results: {
      skip: number;
      limit: number;
      total: number;
    };
  };
  results: any[];
}

export class OpenFDABaseResponseMeta {
  last_updated: Date;
  skip: number;
  limit: number;
  total: number;

  constructor(meta: any) {
    this.last_updated = meta.last_updated;
    this.skip = meta.results.skip;
    this.limit = meta.results.limit;
    this.total = meta.results.total;
  }
}

export class OpenFDACountResponse {
  term: string;
  count: number;

  constructor(term: string, count: number) {
    this.term = term;
    this.count = count;
  }
}