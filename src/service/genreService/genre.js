import { axiosClients } from '@/api/axiosClients';

export const getGenre = async () => {
  return await axiosClients.get('/genres/all').then((res) => {
    return res.data;
  });
};
