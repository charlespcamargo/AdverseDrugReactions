export class OpenFDABaseResponse {
    last_updated: Date;
    limit: number;
    total: number;
    results: [];
  
    constructor(last_updated: Date, limit: number, total: number, results: []) {
        this.last_updated = last_updated;
        this.limit = limit;
        this.total = total;
        this.results = results;
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