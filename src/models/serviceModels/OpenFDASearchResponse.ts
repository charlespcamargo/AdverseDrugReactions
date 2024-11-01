export class OpenFDASearchResponseItem {
    patient: OpenFDASearchResponseItemPatientResponse;

    constructor(patient: OpenFDASearchResponseItemPatientResponse) {
        this.patient = patient;
    }
}

export class OpenFDASearchResponseItemPatientResponse {
    age: number;
    sex: string;
    reaction: OpenFDASearchResponseItemPatientDrugReactionResponse[];

    constructor(age: number, sex: string, reactions: any[]) {
        this.age = age;
        this.sex = sex;
        this.reaction = [];

        reactions.forEach(item => {
            this.reaction.push(new OpenFDASearchResponseItemPatientDrugReactionResponse(item.reactionmeddrapt, item.reactionoutcome as number))            
        });
    }
}


export class OpenFDASearchResponseItemPatientDrugReactionResponse
{
    reactionmeddrapt: string;
    reactionoutcome: number;

    constructor(reactionMedDRApt: string, reactionoutcome: number) {
        this.reactionmeddrapt = reactionMedDRApt;
        this.reactionoutcome = reactionoutcome;
    }
}