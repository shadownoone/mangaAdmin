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

export const createManga = async (mangaData) => {
  try {
    const response = await axiosClients.post('/mangas/create', mangaData);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Error creating manga:', error);
    throw error; // Nếu có lỗi, ném lỗi ra để xử lý bên ngoài
  }
};

export const updateManga = async (id, formData) => {
  return await axiosClients.put(`/mangas/${id}`, formData).then((res) => {
    return res.data;
  });
};

export const getStatistical = async () => {
  return await axiosClients.get('/mangas/statistical').then((res) => {
    return res.data;
  });
};

export const uploadSingleImage = async (base64) => {
  try {
    const response = await axiosClients.post(`/users/uploadImage`, { image: base64 });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // Ném lỗi ra để xử lý bên ngoài nếu cần
  }
};

export const uploadMultipleImages = async (images) => {
  try {
    const response = await axiosClients.post(`/users/uploadMultipleImages`, { images });
    return response.data;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error; // Ném lỗi ra để xử lý bên ngoài nếu cần
  }
};
