export interface CandidateHistoryResponse {
  id: string;
  compayName: string;
  statusName: string;
  createdAt: Date;
  scheduleInterview: Date | null;
  startDate: Date | null;
  note: string | null;
}
