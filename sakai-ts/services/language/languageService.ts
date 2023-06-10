import { ApiEndpoint } from "../api-endpoint";
import api from "../api";
import { PaginatedList } from "../paginatedList";
import { LanguageResponse } from "./dto/languageResponse";
import { CreateOrUpdateLanguageRequest } from "./dto/createOrUpdateLanguageRequest";

export const languageService = {
  create: (body: CreateOrUpdateLanguageRequest) => {
    return api.post(ApiEndpoint.language, body);
  },
  update: (body: CreateOrUpdateLanguageRequest) => {
    return api.put(ApiEndpoint.language, body);
  },
  delete: (id: string) => {
    return api.delete(`${ApiEndpoint.language}/${id}`);
  },
  getById: (id: string) => {
    return api.get<CreateOrUpdateLanguageRequest>(
      `${ApiEndpoint.language}/${id}`
    );
  },
  getsPaging: (params: any) => {
    return api.get<PaginatedList<LanguageResponse>>(ApiEndpoint.language, {
      params: params,
    });
  },
};
