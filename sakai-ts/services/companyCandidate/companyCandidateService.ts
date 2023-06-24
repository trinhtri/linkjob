import { ApiEndpoint } from "../api-endpoint";
import api from "../api";
import { CompanyCandidateByIdResponse } from "./dto/companyCandidateByCompanyAndCandidateResponse";
import { UpdateCompanyCandidateRequest } from "./dto/updateCompanyCandidateRequest";
import { CompanyCandidateByCompanyAndCandidateRequest } from "./dto/companyCandidateByCompanyAndCandidateRequest";

export const companyCandidateService = {
  update: (body: UpdateCompanyCandidateRequest) => {
    return api.put(ApiEndpoint.companyCandidate, body);
  },
  delete: (id: string) => {
    return api.delete(`${ApiEndpoint.companyCandidate}/${id}`);
  },
  getByCompanyAndCandidate: (
    request: CompanyCandidateByCompanyAndCandidateRequest
  ) => {
    return api.get<CompanyCandidateByIdResponse>(ApiEndpoint.companyCandidate, {
      params: request,
    });
  },
};
