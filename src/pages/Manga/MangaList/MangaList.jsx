import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Avatar,
  IconButton,
  TablePagination,
  TextField,
  Grid
} from '@mui/material';
import { BookOutlined, DeleteOutlined, FundViewOutlined } from '@ant-design/icons';
import { getManga, getMangaBySlug, updateManga } from '@/service/mangaService';
import { formatDate } from '@/utils/formatNumber';
import UpdateMangaDialog from '../UpdateMangaForm/UpdateMangaForm';

export default function MangaList() {
  const [listManga, setListManga] = useState([]);
  const [filteredManga, setFilteredManga] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManga, setSelectedManga] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchManga = async () => {
      const data = await getManga();
      setListManga(data.data.data);
      setFilteredManga(data.data.data);
    };
    fetchManga();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = listManga.filter((manga) => manga.title.toLowerCase().includes(term));
    setFilteredManga(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetail = async (slug) => {
    const data = await getMangaBySlug(slug);
    setSelectedManga(data.data);

    console.log('🚀 ~ handleViewDetail ~ data.data:', data.data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedManga(null);
  };

  const handleSaveChanges = async (updatedManga) => {
    try {
      const response = await updateManga(updatedManga.manga_id, updatedManga);
      const updatedData = response.data?.data || response.data;

      if (!updatedData || !updatedData.manga_id) {
        console.error('Dữ liệu cập nhật không hợp lệ:', updatedData);
        return;
      }

      alert('Manga updated successfully!');

      const updatedListManga = listManga.map((manga) => (manga.manga_id === updatedData.manga_id ? updatedData : manga));

      setListManga(updatedListManga);
      setFilteredManga(updatedListManga);
      setSelectedManga(updatedData);
      handleClose();
    } catch (error) {
      console.error('Error updating manga:', error);
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField variant="outlined" placeholder="Search Manga" value={searchTerm} onChange={handleSearch} sx={{ width: '300px' }} />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '10%' }}>
                <b>No.</b>
              </TableCell>
              <TableCell style={{ width: '15%' }}>
                <b>Image</b>
              </TableCell>
              <TableCell style={{ width: '35%' }}>
                <b>Title</b>
              </TableCell>
              <TableCell style={{ width: '20%' }}>
                <b>Updated</b>
              </TableCell>
              <TableCell style={{ width: '20%' }}>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredManga.length > 0 ? (
              filteredManga.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((manga, index) => (
                <TableRow key={manga.manga_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Avatar alt={manga.title} src={manga.cover_image} sx={{ width: 80, height: 80, borderRadius: '0' }} />
                  </TableCell>
                  <TableCell>{manga.title}</TableCell>
                  <TableCell>{formatDate(manga.updatedAt)}</TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton onClick={() => handleViewDetail(manga.slug)}>
                        <FundViewOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chapters">
                      <IconButton onClick={() => handleViewChapters(manga.manga_id)}>
                        <BookOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error">
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredManga.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Sử dụng UpdateMangaDialog */}
      <UpdateMangaDialog open={open} selectedManga={selectedManga} onClose={handleClose} onSave={handleSaveChanges} />
    </div>
  );
}
