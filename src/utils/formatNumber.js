import { format } from 'date-fns';

// Hàm định dạng ngày
export const formatDate = (dateString) => {
  return format(new Date(dateString), 'dd/MM/yyyy'); // Định dạng ngày thành dd/MM/yyyy
};
