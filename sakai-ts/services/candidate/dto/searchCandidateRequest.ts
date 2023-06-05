export interface SearchCandidateCommonRequest {
  filterSearch?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  languages: string[];
}

export interface SearchCandidateRequest {
  first: number;
  pageNumber: number;
  pageSize: number;
  sortField: string | null;
  sortOrder: number | null;
  status: number;
  filterSearch?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  languages: string[];
}
