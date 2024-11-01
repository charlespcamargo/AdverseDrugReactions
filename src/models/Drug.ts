export class Drug {
    last_updated: Date;
    currentPage: number;
    pageSize: number;
    total: number;
    drugName: string;
    reactions: DrugReaction[];

    constructor(last_updated: Date, currentPage: number, pageSize: number, total: number, drugName: string, reactions: DrugReaction[]) {
        this.last_updated = last_updated;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.total = total;
        this.drugName = drugName;
        this.reactions = reactions;
    }
}

export class DrugReaction {
    reactionName: string;
    count: number;
  
    constructor(reactionName: string, count: number) {
        this.reactionName = reactionName;
        this.count = count;
    }
  }