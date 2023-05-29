import { ApiEndpoint } from "../api-endpoint";
import api from "../api";

export const roleService = {
  create: (body: any) => {
    return api.post(ApiEndpoint.role, body);
  },
  update: (body: any) => {
    return api.put(ApiEndpoint.role, body);
  },
  delete: (id: string) => {
    return api.delete(`${ApiEndpoint.role}/${id}`);
  },
  getById: (id: string) => {
    return api.get(`${ApiEndpoint.role}/${id}`);
  },
  getsPaging: (params: any) => {
    return api.get(ApiEndpoint.role, {
      params: params,
    });
  },
};
