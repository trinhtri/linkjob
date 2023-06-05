import api from "../api";
import { ApiEndpoint } from "../api-endpoint";
import { PaginatedList } from "../paginatedList";
import { AcceptOfferRequest } from "./dto/acceptOfferRequest";
import { CandidateInterviewResponse } from "./dto/candidateInterviewResponse";
import { CandidateResponse } from "./dto/candidateResponse";
import { CountForStatusResponse } from "./dto/countForStatusResponse";
import { SendCVRequest } from "./dto/sendCVRequest";
import { SetInterviewScheduleRequest } from "./dto/setInterviewScheduleRequest";
import { SetPassInterviewRequest } from "./dto/setPassInterviewRequest";

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
  getCountForStatus: () => {
    return api.get<CountForStatusResponse>(
      `${ApiEndpoint.candidate}/count-for-status`
    );
  },
  getsPaging: (params: any) => {
    return api.get<PaginatedList<CandidateResponse>>(ApiEndpoint.candidate, {
      params: params,
    });
  },
  getsPagingInterview: (params: any) => {
    return api.get<PaginatedList<CandidateInterviewResponse>>(
      `${ApiEndpoint.candidate}/candidates-interview`,
      {
        params: params,
      }
    );
  },
  sendCV: (body: SendCVRequest) => {
    return api.put(`${ApiEndpoint.candidate}/send-cv`, body);
  },

  setInterviewSchedule: (body: SetInterviewScheduleRequest) => {
    return api.put(`${ApiEndpoint.candidate}/set-interview-schedule`, body);
  },

  setPassInterview: (body: SetPassInterviewRequest) => {
    return api.put(`${ApiEndpoint.candidate}/set-pass-interview`, body);
  },

  acceptOffer: (body: AcceptOfferRequest) => {
    return api.put(`${ApiEndpoint.candidate}/accept-offer`, body);
  },

  getCompaniesByCandidateId: (id: string) => {
    return api.get<string[]>(`${ApiEndpoint.candidate}/${id}/companies`);
  },
};
