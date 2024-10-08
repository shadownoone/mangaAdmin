import { axiosClients } from '@/api/axiosClients';

export const getManga = async () => {
  return await axiosClients.get('/mangas/all').then((res) => {
    return res.data;
  });
};

export const getMangaBySlug = async (slug) => {
  return await axiosClients.get('/mangas/' + slug).then((res) => {
    return res.data;
  });
};
