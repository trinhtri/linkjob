export interface SetInterviewScheduleRequest {
  candidateId: string;
  companyId?: string;
  note?: string;
  interviewSchedule: Date;
}
