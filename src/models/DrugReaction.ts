export class DrugReaction {
  reactionName: string;
  total: number;

  constructor(reactionName: string, total: number) {
      this.reactionName = reactionName;
      this.total = total;
  }
}