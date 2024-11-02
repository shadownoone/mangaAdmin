import { axiosClients } from '@/api/axiosClients';

export const getGenre = async () => {
  return await axiosClients.get('/genres/all').then((res) => {
    return res.data;
  });
};
// Hàm API để thêm một thể loại mới
export const addGenre = async (genreName) => {
  return await axiosClients.post('/genres/add', { genreName }).then((res) => {
    return res.data;
  });
};
