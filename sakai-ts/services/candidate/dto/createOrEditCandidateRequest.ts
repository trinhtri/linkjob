export interface CreateOrEditCandidateRequest {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  degree: string;
  gender: string;
  dateOfBirth: string;
  faceBook: string;
  levelAssessment: string;
  salary: number;
  major: string;
  school: string;
  experience: string;
  homeTown: string;
  address: string;
  wish: string;
  languages: string[];
  cvName: string;
  cvUrl: string;
  supporter: string;
  position: string;
}
