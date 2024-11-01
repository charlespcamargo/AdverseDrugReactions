export class OpenFDACountResponse {
    term: string;
    count: number;
  
    constructor(term: string, count: number) {
        this.term = term;
        this.count = count; 
    }
  }