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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid
} from '@mui/material';
import { DeleteOutlined, FundViewOutlined } from '@ant-design/icons';
import { getManga, getMangaBySlug, updateManga } from '@/service/mangaService'; // Import API theo slug và update
import { formatDate } from '@/utils/formatNumber';

export default function MangaList() {
  const [listManga, setListManga] = useState([]);
  const [filteredManga, setFilteredManga] = useState([]); // Trạng thái lọc Manga
  const [searchTerm, setSearchTerm] = useState(''); // Trạng thái cho từ khóa tìm kiếm
  const [selectedManga, setSelectedManga] = useState(null); // Lưu trữ manga được chọn để hiển thị chi tiết
  const [open, setOpen] = useState(false); // Trạng thái mở dialog
  const [page, setPage] = useState(0); // Trạng thái cho trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số lượng sản phẩm trên mỗi trang

  // Lấy danh sách Manga từ API
  useEffect(() => {
    const fetchManga = async () => {
      const data = await getManga();
      setListManga(data.data.data);
      setFilteredManga(data.data.data); // Đặt danh sách ban đầu vào danh sách đã lọc
    };
    fetchManga();
  }, []);

  // Xử lý tìm kiếm Manga
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Lọc danh sách Manga dựa trên từ khóa tìm kiếm
    const filtered = listManga.filter((manga) => manga.title.toLowerCase().includes(term));
    setFilteredManga(filtered);
  };

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số lượng hàng trên mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Mở dialog và hiển thị chi tiết Manga bằng slug
  const handleViewDetail = async (slug) => {
    const data = await getMangaBySlug(slug); // Gọi API lấy thông tin chi tiết Manga theo slug
    setSelectedManga(data.data); // Lưu trữ dữ liệu Manga được chọn
    setOpen(true); // Mở dialog
  };

  // Đóng dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedManga(null); // Xóa dữ liệu Manga khi đóng form
  };

  // Xử lý cập nhật các trường dữ liệu trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedManga({ ...selectedManga, [name]: value });
  };

  // Xử lý khi người dùng nhấn "Save"
  const handleSaveChanges = async () => {
    try {
      await updateManga(selectedManga.manga_id, selectedManga); // Gọi API cập nhật Manga
      alert('Manga updated successfully!');
      handleClose(); // Đóng form sau khi lưu
    } catch (error) {
      console.error('Error updating manga:', error);
    }
  };

  return (
    <div>
      {/* Bố trí ô tìm kiếm và nút thêm manga trên cùng hàng */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={8}>
          {/* Ô tìm kiếm */}
          <TextField
            variant="outlined"
            placeholder="Search Manga"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: '300px' }} // Điều chỉnh chiều rộng của ô tìm kiếm
          />
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

      {/* Phân trang */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredManga.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog hiển thị chi tiết Manga và cho phép chỉnh sửa */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md" // Giới hạn độ rộng lớn nhất của dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', height: '100%' } }} // Custom kích thước của Dialog
      >
        <DialogTitle>Chi tiết Manga</DialogTitle>
        <DialogContent>
          {selectedManga && (
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <b>Title:</b>
                    </TableCell>
                    <TableCell>
                      <TextField fullWidth name="title" value={selectedManga.title} onChange={handleInputChange} />
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
                        value={selectedManga.description}
                        onChange={handleInputChange}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Author:</b>
                    </TableCell>
                    <TableCell>
                      <TextField fullWidth name="author" value={selectedManga.author} onChange={handleInputChange} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Genres:</b>
                    </TableCell>
                    <TableCell>{selectedManga.genres.map((genre) => genre.name).join(', ')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Views:</b>
                    </TableCell>
                    <TableCell>{selectedManga.views}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Followers:</b>
                    </TableCell>
                    <TableCell>{selectedManga.followers}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Status:</b>
                    </TableCell>
                    <TableCell>{selectedManga.status === 1 ? 'Completed' : 'Ongoing'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
