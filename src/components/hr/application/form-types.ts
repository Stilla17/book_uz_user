export type HrExperienceFormValue = {
    organization: string;
    startedAt: string;
    endedAt: string;
    position: string;
    leavingReason: string;
};

export type HrApplicationFormValues = {
    firstName: string;
    lastName: string;
    middleName: string;
    birthDate: string;
    birthPlace: string;
    currentAddress: string;
    registeredAddress: string;
    phone: string;
    nationality: string;
    citizenship: string;
    passportSeries: string;
    passportNumber: string;
    passportIssuedAt: string;
    passportIssuedBy: string;
    maritalStatus: string;
    heightCm: string;
    weightKg: string;
    clothingSize: string;
    shoeSize: string;
    institution: string;
    faculty: string;
    fieldOfStudy: string;
    specialty: string;
    graduationYear: string;
    additionalEducation: string;
    hobbies: string;
    recentlyReadBooks: string;
    sports: string;
    workExperience: HrExperienceFormValue[];
    personalDataConsent: boolean;
};

export const emptyExperience = (): HrExperienceFormValue => ({
    organization: '',
    startedAt: '',
    endedAt: '',
    position: '',
    leavingReason: ''
});
