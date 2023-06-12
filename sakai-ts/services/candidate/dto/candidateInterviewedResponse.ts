export interface CandidateInterviewedResponse {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  salary: number;
  companyName: string;
  cvName: string;
  cvUrl: string;
  interviewSchedule: Date | null;
}
