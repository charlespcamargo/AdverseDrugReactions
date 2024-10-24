export interface Reaction {
    reaction: string;
    count: number;
  }
  
  export interface Drug {
    name: string;
    reactions: Reaction[];
  }
  