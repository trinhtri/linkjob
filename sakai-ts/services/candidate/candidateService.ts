import api from "../api";
import { ApiEndpoint } from "../api-endpoint";
import { PaginatedList } from "../paginatedList";
import { AcceptOfferRequest } from "./dto/acceptOfferRequest";
import { CandidateHistoryResponse } from "./dto/candidateHistoryResponse";
import { CandidateInterviewResponse } from "./dto/candidateInterviewResponse";
import { CandidateInterviewedResponse } from "./dto/candidateInterviewedResponse";
import { CandidateResponse } from "./dto/candidateResponse";
import { CountForStatusResponse } from "./dto/countForStatusResponse";
import { CreateOrEditCandidateRequest } from "./dto/createOrEditCandidateRequest";
import { QuickCreateCandidateRequest } from "./dto/quickCreateCandidateRequest";
import { SendCVRequest } from "./dto/sendCVRequest";
import { SetInterviewScheduleRequest } from "./dto/setInterviewScheduleRequest";
import { SetInterviewedRequest } from "./dto/setInterviewedRequest";
import { SetPassInterviewRequest } from "./dto/setPassInterviewRequest";

export const candidateService = {
  create: (body: any) => {
    return api.post(ApiEndpoint.candidate, body);
  },
  quickCreate: (body: QuickCreateCandidateRequest) => {
    return api.post(`${ApiEndpoint.candidate}/quick-create`, body);
  },
  update: (body: any) => {
    return api.put(ApiEndpoint.candidate, body);
  },
  delete: (id: any) => {
    return api.delete(`${ApiEndpoint.candidate}/${id}`);
  },
  getById: (id: any) => {
    return api.get<CreateOrEditCandidateRequest>(
      `${ApiEndpoint.candidate}/${id}`
    );
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
  getsPagingInterviewed: (params: any) => {
    return api.get<PaginatedList<CandidateInterviewedResponse>>(
      `${ApiEndpoint.candidate}/candidates-interviewed`,
      {
        params: params,
      }
    );
  },
  getsPagingAppling: (params: any) => {
    return api.get<PaginatedList<CandidateInterviewResponse>>(
      `${ApiEndpoint.candidate}/candidates-appling`,
      {
        params: params,
      }
    );
  },
  getsPagingPassed: (params: any) => {
    return api.get<PaginatedList<CandidateInterviewResponse>>(
      `${ApiEndpoint.candidate}/candidates-passed`,
      {
        params: params,
      }
    );
  },
  getsPagingAccepted: (params: any) => {
    return api.get<PaginatedList<CandidateInterviewResponse>>(
      `${ApiEndpoint.candidate}/candidates-accepted`,
      {
        params: params,
      }
    );
  },
  getsCandidateHistories: (id: string) => {
    return api.get<CandidateHistoryResponse[]>(
      `${ApiEndpoint.candidate}/${id}/candidate-histories`
    );
  },
  sendCV: (body: SendCVRequest) => {
    return api.put(`${ApiEndpoint.candidate}/send-cv`, body);
  },
  setInterviewSchedule: (body: SetInterviewScheduleRequest) => {
    return api.put(`${ApiEndpoint.candidate}/interview-schedule`, body);
  },
  setPassInterview: (body: SetPassInterviewRequest) => {
    return api.put(`${ApiEndpoint.candidate}/pass-interview`, body);
  },
  setInterviewed: (body: SetInterviewedRequest) => {
    return api.put(`${ApiEndpoint.candidate}/interviewed`, body);
  },
  setRejectInterview: (body: SetInterviewedRequest) => {
    return api.put(`${ApiEndpoint.candidate}/reject-cv`, body);
  },
  setFaildInterview: (body: SetInterviewedRequest) => {
    return api.put(`${ApiEndpoint.candidate}/faild-interview`, body);
  },
  acceptOffer: (body: AcceptOfferRequest) => {
    return api.put(`${ApiEndpoint.candidate}/accept-offer`, body);
  },
  rejectOffer: (body: AcceptOfferRequest) => {
    return api.put(`${ApiEndpoint.candidate}/reject-offer`, body);
  },
  getCompaniesByCandidateId: (id: string) => {
    return api.get<string[]>(`${ApiEndpoint.candidate}/${id}/companies`);
  },
};
