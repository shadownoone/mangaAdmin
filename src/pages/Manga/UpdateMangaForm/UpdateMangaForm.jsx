import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { getGenre, addGenre } from '@/service/genreService/genre';

export default function UpdateMangaDialog({ open, selectedManga, onClose, onSave }) {
  const [mangaData, setMangaData] = useState(selectedManga || {});
  const [availableGenres, setAvailableGenres] = useState([]);

  useEffect(() => {
    if (selectedManga) {
      const genres = selectedManga.genres?.map((item) => (typeof item === 'string' ? item : item.name)) || [];
      setMangaData({ ...selectedManga, genres });
      console.log('Selected Manga Data:', mangaData); // Kiểm tra mangaData
    }
  }, [selectedManga]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenre();
        console.log('Genres response from API:', response); // Kiểm tra cấu trúc dữ liệu từ API

        const genreNames = response.data.data.map((genre) => genre.name);
        setAvailableGenres(genreNames);
        console.log('Available Genres:', genreNames); // Kiểm tra availableGenres sau khi xử lý
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMangaData({ ...mangaData, [name]: value });
  };

  const handleGenresChange = (event, value) => {
    const genres = value.map((item) => (typeof item === 'string' ? item : item.name));
    setMangaData({ ...mangaData, genres });
    console.log('Updated mangaData.genres:', genres);
  };

  const handleSaveChanges = async () => {
    try {
      console.log('Available Genres:', availableGenres); // Kiểm tra danh sách thể loại hiện tại trong availableGenres
      console.log('Current mangaData.genres:', mangaData.genres); // Kiểm tra danh sách thể loại hiện tại trong mangaData.genres

      // Chuyển tất cả các giá trị trong availableGenres thành chữ thường để so sánh chính xác
      const normalizedAvailableGenres = availableGenres.map((genre) => genre.toLowerCase());
      const newGenres = mangaData.genres.filter((genre) => !normalizedAvailableGenres.includes(genre.toLowerCase()));

      console.log('New genres to add:', newGenres); // Log để kiểm tra danh sách thể loại mới

      // Gọi API để thêm các thể loại mới vào backend
      for (const genreName of newGenres) {
        const result = await addGenre(genreName);
        console.log(`Added genre ${genreName}:`, result); // Kiểm tra từng kết quả thêm thể loại
      }

      // Cập nhật danh sách `availableGenres` với các thể loại vừa thêm
      setAvailableGenres([...availableGenres, ...newGenres]);

      // Gọi hàm `onSave` với `mangaData` sau khi cập nhật
      onSave(mangaData);
      onClose();
    } catch (error) {
      console.error('Error saving new genres:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" sx={{ '& .MuiDialog-paper': { width: '100%', height: '100%' } }}>
      <DialogTitle>Chi tiết Manga</DialogTitle>
      <DialogContent>
        {mangaData && (
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <b>Title:</b>
                  </TableCell>
                  <TableCell>
                    <TextField fullWidth name="title" value={mangaData.title || ''} onChange={handleInputChange} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Description:</b>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="description"
                      value={mangaData.description || ''}
                      onChange={handleInputChange}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Genres:</b>
                  </TableCell>
                  <TableCell>
                    <Autocomplete
                      multiple
                      options={availableGenres}
                      freeSolo
                      value={mangaData.genres || []}
                      onChange={handleGenresChange}
                      renderInput={(params) => <TextField {...params} label="Genres" placeholder="Choose or add genres" />}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Author:</b>
                  </TableCell>
                  <TableCell>
                    <TextField fullWidth name="author" value={mangaData.author || ''} onChange={handleInputChange} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Views:</b>
                  </TableCell>
                  <TableCell>{mangaData.views}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Followers:</b>
                  </TableCell>
                  <TableCell>{mangaData.followers}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Status:</b>
                  </TableCell>
                  <TableCell>{mangaData.status === 1 ? 'Completed' : 'Ongoing'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
