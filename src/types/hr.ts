export type HrStatus = 'new' | 'reviewing' | 'approved' | 'rejected';

export type HrWorkExperience = {
    organization?: string;
    startedAt?: string;
    endedAt?: string;
    position?: string;
    leavingReason?: string;
};

export type HrApplication = {
    _id: string;
    applicationNumber: string;
    status: HrStatus;
    firstName: string;
    lastName: string;
    middleName?: string;
    photo?: { url?: string; publicId?: string };
    birthDate: string;
    birthPlace: string;
    currentAddress: string;
    registeredAddress?: string;
    phone: string;
    nationality?: string;
    citizenship?: string;
    passport?: { series?: string; number?: string; issuedAt?: string; issuedBy?: string };
    maritalStatus?: string;
    heightCm?: number;
    weightKg?: number;
    clothingSize?: string;
    shoeSize?: string;
    education?: {
        institution?: string;
        faculty?: string;
        fieldOfStudy?: string;
        specialty?: string;
        graduationYear?: number;
    };
    additionalEducation?: string[];
    hobbies?: string[];
    recentlyReadBooks?: string;
    sports?: string;
    workExperience?: HrWorkExperience[];
    personalDataConsent: boolean;
    adminNote?: string;
    submittedAt: string;
    createdAt: string;
};

export type HrPagination = {
    page: number;
    limit: number;
    total: number;
    pages: number;
};

export type HrApplicationsResponse = {
    applications: HrApplication[];
    pagination: HrPagination;
};
