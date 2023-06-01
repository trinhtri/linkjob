import api from "../api";
import { ApiEndpoint } from "../api-endpoint";
import { PaginatedList } from "../paginatedList";
import { CandidateResponse } from "./dto/candidateResponse";

export const candidateService = {
  create: (body: any) => {
    return api.post(ApiEndpoint.candidate, body);
  },
  update: (body: any) => {
    return api.put(ApiEndpoint.candidate, body);
  },
  delete: (id: any) => {
    return api.delete(`${ApiEndpoint.candidate}/${id}`);
  },
  getById: (id: any) => {
    return api.get(`${ApiEndpoint.candidate}/${id}`);
  },
  getsPaging: (params: any) => {
    return api.get<PaginatedList<CandidateResponse>>(ApiEndpoint.candidate, {
      params: params,
    });
  },
};
