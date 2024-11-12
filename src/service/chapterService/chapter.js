import { axiosClients } from '@/api/axiosClients';

export const createChapter = async (manga_id, chapter_number, title, images) => {
  try {
    const response = await axiosClients.post('/chapters/', {
      manga_id,
      chapter_number,
      title,
      images // Mảng URL hình ảnh
    });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Error creating chapter:', error);
    throw error; // Nếu có lỗi, ném lỗi ra để xử lý bên ngoài
  }
};
