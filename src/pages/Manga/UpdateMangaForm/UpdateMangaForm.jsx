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
  Checkbox,
  Avatar
} from '@mui/material';
import { getGenre, addGenre } from '@/service/genreService/genre';
import assets from '@/assets/images/users/assets.gif'; // Loading image
import { uploadSingleImage } from '@/service/mangaService';
import { toast } from 'react-toastify';

export default function UpdateMangaDialog({ open, selectedManga, onClose, onSave }) {
  const [mangaData, setMangaData] = useState(selectedManga || {});
  const [availableGenres, setAvailableGenres] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for image upload
  const [isImageUploaded, setIsImageUploaded] = useState(false); // Image upload success state

  // Load initial manga data and genres
  useEffect(() => {
    if (selectedManga) {
      const genres = selectedManga.genres?.map((item) => (typeof item === 'string' ? item : item.name)) || [];
      setMangaData({ ...selectedManga, genres });
    }
  }, [selectedManga]);

  // Load available genres from API
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

  // Convert file to base64 for image upload
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload
  const uploadImage = async (event) => {
    const files = event.target.files;
    const base64 = await convertBase64(files[0]);

    try {
      setLoading(true);
      const uploadedUrl = await uploadSingleImage(base64);
      setMangaData({ ...mangaData, cover_image: uploadedUrl }); // Update cover_image in mangaData
      setIsImageUploaded(true);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

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

  // Handle status dropdown change
  const handleStatusChange = (event) => {
    setMangaData({ ...mangaData, status: event.target.value });
  };

  // Handle VIP checkbox change
  const handleVipChange = (event) => {
    setMangaData({ ...mangaData, is_vip: event.target.checked });
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    try {
      // Check for new genres and add them to the database
      const normalizedAvailableGenres = availableGenres.map((genre) => genre.toLowerCase());
      const newGenres = mangaData.genres.filter((genre) => !normalizedAvailableGenres.includes(genre.toLowerCase()));

      for (const genreName of newGenres) {
        await addGenre(genreName);
      }

      // Update available genres list to include new genres
      setAvailableGenres([...availableGenres, ...newGenres]);

      // Call onSave with updated manga data
      onSave(mangaData);
      onClose();
    } catch (error) {
      console.error('Error saving new genres:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Update Manga Details</DialogTitle>
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

                {/* Image Upload Field */}
                <TableRow>
                  <TableCell>
                    <b>Image:</b>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" component="label">
                      {loading ? <img src={assets} alt="loading" style={{ width: 24, height: 24 }} /> : 'Upload Cover Image'}
                      <input type="file" hidden onChange={uploadImage} />
                    </Button>
                    {isImageUploaded && <Avatar alt="cover_image" src={mangaData.cover_image} sx={{ width: 100, height: 100, mt: 2 }} />}
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
                    <b>Is VIP:</b>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={<Checkbox checked={!!mangaData.is_vip} onChange={handleVipChange} color="primary" />}
                      label="VIP"
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
