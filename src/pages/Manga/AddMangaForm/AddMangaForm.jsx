import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Avatar } from '@mui/material';
import { createManga, uploadSingleImage } from '@/service/mangaService';
import { toast } from 'react-toastify';
import assets from '@/assets/images/users/assets.gif'; // Ảnh loading

export default function AddMangaForm({ open, handleClose, onMangaAdded }) {
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [url, setUrl] = useState(''); // URL ảnh sau khi upload
  const [isImageUploaded, setIsImageUploaded] = useState(false); // Trạng thái ảnh đã upload thành công
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image: '',
    author: ''
  });

  // Chuyển file thành base64
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  // Upload ảnh
  const uploadImage = async (event) => {
    const files = event.target.files;
    const base64 = await convertBase64(files[0]);

    try {
      setLoading(true); // Bắt đầu trạng thái loading
      const uploadedUrl = await uploadSingleImage(base64);
      setUrl(uploadedUrl); // Set URL của ảnh sau khi upload
      setIsImageUploaded(true); // Đánh dấu là ảnh đã được upload
      setFormData({ ...formData, cover_image: uploadedUrl }); // Cập nhật URL ảnh vào formData
      toast.success('Upload ảnh thành công');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  // Xử lý thay đổi dữ liệu nhập vào form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gọi API để thêm Manga mới
  const handleSubmit = async () => {
    try {
      const result = await createManga(formData); // Gọi API tạo Manga
      toast.success('Manga created successfully!'); // Hiển thị thông báo thành công
      onMangaAdded(result.data); // Gọi callback để cập nhật danh sách manga
      handleClose(); // Đóng form sau khi thêm mới thành công
    } catch (error) {
      if (error.response && error.response.data.message === 'Manga with this title already exists') {
        toast.error('Manga với tiêu đề này đã tồn tại. Vui lòng chọn tiêu đề khác.');
      } else {
        toast.error('Error creating manga!');
        console.error('Error creating manga:', error); // Hiển thị lỗi nếu có
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Manga</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Title" fullWidth name="title" value={formData.title} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label">
              {loading ? <img src={assets} alt="loading" style={{ width: 24, height: 24 }} /> : 'Upload Cover Image'}
              <input type="file" hidden onChange={uploadImage} />
            </Button>
            {isImageUploaded && <Avatar alt="cover_image" src={url} sx={{ width: 100, height: 100, mt: 2 }} />}
          </Grid>
          <Grid item xs={12}>
            <TextField label="Author" fullWidth name="author" value={formData.author} onChange={handleInputChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Manga
        </Button>
      </DialogActions>
    </Dialog>
  );
}
