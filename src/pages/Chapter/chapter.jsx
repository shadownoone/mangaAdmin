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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { BookOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getManga, getMangaBySlug } from '@/service/mangaService';
import { formatDate } from '@/utils/formatNumber';
import { createChapter } from '@/service/chapterService/chapter';

export default function Chapter() {
  const [listManga, setListManga] = useState([]);
  const [filteredManga, setFilteredManga] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManga, setSelectedManga] = useState(null);
  const [open, setOpen] = useState(false); // Dialog state for chapter list
  const [openChapterDialog, setOpenChapterDialog] = useState(false); // Dialog state for add/edit chapter
  const [currentChapter, setCurrentChapter] = useState(null); // For editing a chapter
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterNumber, setNewChapterNumber] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for chapter pagination and search
  const [chapterPage, setChapterPage] = useState(0);
  const [chaptersPerPage, setChaptersPerPage] = useState(5);
  const [chapterSearchTerm, setChapterSearchTerm] = useState(''); // State for chapter search term
  const [filteredChapters, setFilteredChapters] = useState([]); // State for filtered chapters

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

  const handleViewChapters = async (slug) => {
    const data = await getMangaBySlug(slug);
    setSelectedManga(data.data); // Contains chapters as well
    setFilteredChapters(data.data.chapters); // Initialize filtered chapters with all chapters
    setOpen(true); // Open the dialog to view chapters
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedManga(null);
  };

  const handleAddChapter = () => {
    setCurrentChapter(null); // Clear previous chapter data for adding a new one
    setNewChapterTitle('');
    setNewChapterNumber('');
    setOpenChapterDialog(true);
  };

  const handleEditChapter = (chapter) => {
    setCurrentChapter(chapter);
    setNewChapterTitle(chapter.title);
    setNewChapterNumber(chapter.chapter_number);
    setOpenChapterDialog(true);
  };

  const handleDeleteChapter = async (chapterId) => {
    await deleteChapter(chapterId); // Call delete API
    const updatedChapters = selectedManga.chapters.filter((ch) => ch.chapter_id !== chapterId);
    setSelectedManga({ ...selectedManga, chapters: updatedChapters });
    setFilteredChapters(updatedChapters); // Update filtered chapters
  };

  const handleSaveChapter = async () => {
    try {
      if (currentChapter) {
        const updatedChapter = await updateChapter(currentChapter.chapter_id, {
          title: newChapterTitle,
          chapter_number: newChapterNumber
        });

        const updatedChapters = selectedManga.chapters.map((ch) => (ch.chapter_id === updatedChapter.chapter_id ? updatedChapter : ch));
        setSelectedManga((prevManga) => ({
          ...prevManga,
          chapters: updatedChapters
        }));
        setFilteredChapters(updatedChapters); // Update filtered chapters
      } else {
        const newChapterResponse = await createChapter(selectedManga.manga_id, newChapterNumber, newChapterTitle, []);

        if (!newChapterResponse || !newChapterResponse.data) {
          console.error('Failed to create chapter, no valid data returned.');
          return;
        }

        const newChapterData = newChapterResponse.data;
        setSelectedManga((prevManga) => ({
          ...prevManga,
          chapters: [...prevManga.chapters, newChapterData].sort((a, b) => a.chapter_number - b.chapter_number)
        }));
        setFilteredChapters([...selectedManga.chapters, newChapterData]); // Update filtered chapters
      }

      setOpenChapterDialog(false); // Close the add/edit chapter dialog
    } catch (error) {
      console.error('Error saving chapter:', error);
    }
  };

  const handleCloseChapterDialog = () => {
    setOpenChapterDialog(false);
  };

  // Handle chapter pagination changes
  const handleChapterPageChange = (event, newPage) => {
    setChapterPage(newPage);
  };

  const handleChaptersPerPageChange = (event) => {
    setChaptersPerPage(parseInt(event.target.value, 10));
    setChapterPage(0);
  };

  // Handle chapter search
  const handleChapterSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setChapterSearchTerm(term);
    const filtered = selectedManga.chapters.filter((chapter) => chapter.title.toLowerCase().includes(term));
    setFilteredChapters(filtered);
    setChapterPage(0); // Reset to first page after search
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
                    <Tooltip title="Chapters">
                      <IconButton onClick={() => handleViewChapters(manga.slug)}>
                        <BookOutlined />
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

      {/* Dialog to display list of chapters */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth disableEnforceFocus disableAutoFocus>
        <DialogTitle>Chapter List for {selectedManga?.title}</DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            placeholder="Search Chapter"
            value={chapterSearchTerm}
            onChange={handleChapterSearch}
            sx={{ mb: 2, width: '100%' }}
          />
          <Button startIcon={<PlusOutlined />} onClick={handleAddChapter} sx={{ mb: 2 }}>
            Add Chapter
          </Button>
          {filteredChapters.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>No.</b>
                  </TableCell>
                  <TableCell>
                    <b>Chapter Title</b>
                  </TableCell>
                  <TableCell>
                    <b>Updated</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredChapters
                  .slice(chapterPage * chaptersPerPage, chapterPage * chaptersPerPage + chaptersPerPage)
                  .map((chapter, index) => (
                    <TableRow key={chapter.chapter_id}>
                      <TableCell>{chapterPage * chaptersPerPage + index + 1}</TableCell>
                      <TableCell>{chapter.title}</TableCell>
                      <TableCell>{formatDate(chapter.createdAt)}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditChapter(chapter)}>
                            <EditOutlined />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDeleteChapter(chapter.chapter_id)}>
                            <DeleteOutlined />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <p>No chapters found.</p>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredChapters.length}
            rowsPerPage={chaptersPerPage}
            page={chapterPage}
            onPageChange={handleChapterPageChange}
            onRowsPerPageChange={handleChaptersPerPageChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding/editing a chapter */}
      <Dialog open={openChapterDialog} onClose={handleCloseChapterDialog}>
        <DialogTitle>{currentChapter ? 'Edit Chapter' : 'Add Chapter'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Chapter Title"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Chapter Number"
            value={newChapterNumber}
            onChange={(e) => setNewChapterNumber(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChapterDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveChapter}>
            {currentChapter ? 'Save Changes' : 'Add Chapter'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
