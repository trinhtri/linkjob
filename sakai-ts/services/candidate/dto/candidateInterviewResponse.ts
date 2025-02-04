export interface CandidateInterviewResponse {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  salary: number;
  companyName: string;
  cvName: string;
  cvUrl: string;
  position: string | null;
  interviewSchedule: Date | null;
}
