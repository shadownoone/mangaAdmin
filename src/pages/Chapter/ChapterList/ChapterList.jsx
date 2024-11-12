// ChapterList.js
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  TextField,
  Tooltip,
  TablePagination
} from '@mui/material';
import { BookOutlined } from '@ant-design/icons';
import { getManga } from '@/service/mangaService';

const ChapterList = ({ onViewChapters }) => {
  const [listManga, setListManga] = useState([]);
  const [filteredManga, setFilteredManga] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    setFilteredManga(listManga.filter((manga) => manga.title.toLowerCase().includes(term)));
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <TextField variant="outlined" placeholder="Search Manga" value={searchTerm} onChange={handleSearch} sx={{ width: '300px', mb: 2 }} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredManga.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((manga, index) => (
              <TableRow key={manga.manga_id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <Avatar alt={manga.title} src={manga.cover_image} sx={{ width: 80, height: 80 }} />
                </TableCell>
                <TableCell>{manga.title}</TableCell>
                <TableCell>{manga.updatedAt}</TableCell>
                <TableCell>
                  <Tooltip title="Chapters">
                    <IconButton onClick={() => onViewChapters(manga)}>
                      <BookOutlined />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        count={filteredManga.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ChapterList;
