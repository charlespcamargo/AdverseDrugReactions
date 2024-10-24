import { DrugReaction } from './DrugReaction';

export class Drug {
    drugName: string;
    reactions: DrugReaction[];

    constructor(drugName: string, reactions: DrugReaction[]) {
        this.drugName = drugName;
        this.reactions = reactions;
    }
}