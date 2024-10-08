import { axiosClients } from '../../api/axiosClients';

export const getCurrentUser = async () => {
  return await axiosClients.get('/auth/current-user').then((res) => {
    return res.data;
  });
};

export const getAllUser = async () => {
  return await axiosClients.get('/users/all').then((res) => {
    return res.data;
  });
};
