import { ApiEndpoint } from '../api-endpoint';
import api from '../api';

export const roleService = {
    create: (body) => {
        return api.post(ApiEndpoint.role, body);
    },
    update: (body) => {
        return api.put(ApiEndpoint.role, body);
    },
    delete: (id) => {
        return api.delete(`${ApiEndpoint.role}/${id}`);
    },
    getById: (id) => {
        return api.get(`${ApiEndpoint.role}/${id}`);
    },
    getsPaging: (params) => {
        return api.get(ApiEndpoint.role, {
            params: params
        });
    }
};
