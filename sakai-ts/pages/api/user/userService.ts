import Router from "next/router";
import api from "../api";
import { ApiEndpoint } from "../api-endpoint";

export const userService = {
  login: (username: string, password: string) => {
    return api
      .post(ApiEndpoint.login, { email: username, password })
      .then((response) => {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
      });
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    Router.push("/login");
  },
  create: (body: any) => {
    return api.post(ApiEndpoint.user, body);
  },
  update: (body: any) => {
    return api.put(ApiEndpoint.user, body);
  },
  delete: (id: any) => {
    return api.delete(`${ApiEndpoint.user}/${id}`);
  },
  getById: (id: any) => {
    return api.get(`${ApiEndpoint.user}/${id}`);
  },
  getsPaging: (params: any) => {
    return api.get(ApiEndpoint.user, {
      params: params,
    });
  },
  changePassword: (body: any) => {
    return api.put(`${ApiEndpoint.user}/change-password`, body);
  },
};
