export interface UpdateCompanyCandidateRequest {
  companyId: string;
  candidateId: string;
  position: string;
  note: string | null;
}
