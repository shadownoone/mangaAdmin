import React, { useState } from 'react';
import { Button, Container } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import MangaList from './MangaList/MangaList';
import AddMangaForm from './AddMangaForm/AddMangaForm';

export default function MangaAdmin() {
  const [open, setOpen] = useState(false); // Trạng thái mở form
  // eslint-disable-next-line no-unused-vars
  const [listManga, setListManga] = useState([]); // Danh sách Manga

  // Xử lý khi form được mở
  const handleOpen = () => {
    setOpen(true);
  };

  // Xử lý khi form đóng
  const handleClose = () => {
    setOpen(false);
  };

  // Xử lý khi thêm Manga mới
  const handleMangaAdded = (newManga) => {
    setListManga((prevList) => [...prevList, newManga]);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Manga
      </Button>

      {/* Hiển thị danh sách Manga */}
      <MangaList />

      {/* Form thêm Manga */}
      <AddMangaForm open={open} handleClose={handleClose} onMangaAdded={handleMangaAdded} />
    </Container>
  );
}
