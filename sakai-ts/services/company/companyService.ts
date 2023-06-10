import { ApiEndpoint } from "../api-endpoint";
import api from "../api";
import { PaginatedList } from "../paginatedList";
import { CreateOrUpdateCompanyRequest } from "./dto/createOrUpdateCompanyRequest";
import { CompanyResponse } from "./dto/companyResponse";

export const companyService = {
  create: (body: CreateOrUpdateCompanyRequest) => {
    return api.post(ApiEndpoint.company, body);
  },
  update: (body: CreateOrUpdateCompanyRequest) => {
    return api.put(ApiEndpoint.company, body);
  },
  delete: (id: string) => {
    return api.delete(`${ApiEndpoint.company}/${id}`);
  },
  getById: (id: string) => {
    return api.get<CreateOrUpdateCompanyRequest>(
      `${ApiEndpoint.company}/${id}`
    );
  },
  getsPaging: (params: any) => {
    return api.get<PaginatedList<CompanyResponse>>(ApiEndpoint.company, {
      params: params,
    });
  },
};
