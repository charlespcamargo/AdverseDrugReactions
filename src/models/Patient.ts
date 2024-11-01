export class Patient {
    age: number;
    sex: PatientSex;
    reactions: PatientDrugReaction[];

    constructor(age: number, sex: string, reactions: PatientDrugReaction[]) {
        this.age = age;
        this.sex = this.getPatientSex(sex);
        this.reactions = reactions;
    }

    getPatientSex(sex: String): PatientSex {
        const patientSexValue = Number(sex);
        const patientSex: PatientSex = PatientSex[patientSexValue] !== undefined
            ? patientSexValue as PatientSex
            : PatientSex.Unknown;

        return patientSex;
    }
}

export class PatientDrugReaction {
    reactionName: string;

    constructor(reactionName: string, count: number) {
        this.reactionName = reactionName;
    }
}


enum PatientSex {
    Unknown = 0,
    Male = 1,
    Female = 2
} 