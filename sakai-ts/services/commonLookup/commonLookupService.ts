import api from "../api";
import { ApiEndpoint } from "../api-endpoint";
import { CommonLookupRequest } from "./dto/commonLookupRequest";
import { CommonLookupResponse } from "./dto/commonLookupResponse";

export const commonLookupService = {
  getLookup: (params: CommonLookupRequest) => {
    return api.get<CommonLookupResponse[]>(ApiEndpoint.commonLookup, {
      params: params,
    });
  },
};
