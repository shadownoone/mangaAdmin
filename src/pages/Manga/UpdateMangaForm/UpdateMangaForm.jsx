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
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { getGenre, addGenre } from '@/service/genreService/genre';

export default function UpdateMangaDialog({ open, selectedManga, onClose, onSave }) {
  const [mangaData, setMangaData] = useState(selectedManga || {});
  const [availableGenres, setAvailableGenres] = useState([]);

  // Load initial manga data and genres
  useEffect(() => {
    if (selectedManga) {
      const genres = selectedManga.genres?.map((item) => (typeof item === 'string' ? item : item.name)) || [];
      setMangaData({ ...selectedManga, genres });
    }
  }, [selectedManga]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenre();
        const genreNames = response.data.data.map((genre) => genre.name);
        setAvailableGenres(genreNames);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMangaData({ ...mangaData, [name]: value });
  };

  // Handle genre selection and updating
  const handleGenresChange = (event, value) => {
    const genres = value.map((item) => (typeof item === 'string' ? item : item.name));
    setMangaData({ ...mangaData, genres });
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    try {
      // Normalize genres to check for new genres
      const normalizedAvailableGenres = availableGenres.map((genre) => genre.toLowerCase());
      const newGenres = mangaData.genres.filter((genre) => !normalizedAvailableGenres.includes(genre.toLowerCase()));

      // Add new genres to the database if they don't already exist
      for (const genreName of newGenres) {
        await addGenre(genreName);
      }

      // Update available genres to include new genres
      setAvailableGenres([...availableGenres, ...newGenres]);

      // Call onSave with the updated manga data
      onSave(mangaData);
      onClose();
    } catch (error) {
      console.error('Error saving new genres:', error);
    }
  };

  // Handle changes to status field (dropdown)
  const handleStatusChange = (event) => {
    setMangaData({ ...mangaData, status: event.target.value });
  };

  // Handle changes to is_vip field (checkbox)
  const handleVipChange = (event) => {
    setMangaData({ ...mangaData, is_vip: event.target.checked });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Chi tiết Manga</DialogTitle>
      <DialogContent>
        {mangaData && (
          <TableContainer>
            <Table>
              <TableBody>
                {/* Title Field */}
                <TableRow>
                  <TableCell>
                    <b>Title:</b>
                  </TableCell>
                  <TableCell>
                    <TextField fullWidth name="title" value={mangaData.title || ''} onChange={handleInputChange} />
                  </TableCell>
                </TableRow>

                {/* Description Field */}
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

                {/* Genres Field */}
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

                {/* Author Field */}
                <TableRow>
                  <TableCell>
                    <b>Author:</b>
                  </TableCell>
                  <TableCell>
                    <TextField fullWidth name="author" value={mangaData.author || ''} onChange={handleInputChange} />
                  </TableCell>
                </TableRow>

                {/* Views Field */}
                <TableRow>
                  <TableCell>
                    <b>Views:</b>
                  </TableCell>
                  <TableCell>{mangaData.views}</TableCell>
                </TableRow>

                {/* Followers Field */}
                <TableRow>
                  <TableCell>
                    <b>Followers:</b>
                  </TableCell>
                  <TableCell>{mangaData.followers}</TableCell>
                </TableRow>

                {/* Status Field */}
                <TableRow>
                  <TableCell>
                    <b>Status:</b>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select name="status" value={mangaData.status || 0} onChange={handleStatusChange}>
                        <MenuItem value={1}>Completed</MenuItem>
                        <MenuItem value={0}>On Going</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>

                {/* VIP Status Field */}
                <TableRow>
                  <TableCell>
                    <b>IsVip:</b>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={<Checkbox checked={!!mangaData.is_vip} onChange={handleVipChange} color="primary" />}
                      label="Vip"
                    />
                  </TableCell>
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
