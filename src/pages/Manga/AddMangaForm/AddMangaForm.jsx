import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Avatar,
  Autocomplete,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { createManga, uploadSingleImage } from '@/service/mangaService';
import { getGenre, addGenre } from '@/service/genreService/genre';
import { toast } from 'react-toastify';
import assets from '@/assets/images/users/assets.gif'; // Loading image

export default function AddMangaForm({ open, handleClose, onMangaAdded }) {
  const [availableGenres, setAvailableGenres] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for image upload
  const [url, setUrl] = useState(''); // URL for uploaded image
  const [isImageUploaded, setIsImageUploaded] = useState(false); // Image upload success state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image: '',
    author: '',
    genres: [],
    isVip: ''
  });

  // Load available genres from the API
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

  // Handle VIP checkbox change
  const handleVipChange = (event) => {
    setFormData({ ...formData, is_vip: event.target.checked });
  };

  // Convert file to base64
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
      setUrl(uploadedUrl);
      setIsImageUploaded(true);
      setFormData({ ...formData, cover_image: uploadedUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for other fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle genre selection or creation of new genres
  const handleGenresChange = async (event, value) => {
    const genres = value.map((item) => item.toLowerCase()); // Normalize genres to lowercase
    const newGenres = genres.filter((genre) => !availableGenres.includes(genre));

    // Add new genres to the database if they don't already exist
    for (const genre of newGenres) {
      try {
        await addGenre(genre);
        setAvailableGenres((prev) => [...prev, genre]);
      } catch (error) {
        console.error(`Error adding new genre ${genre}:`, error);
      }
    }

    // Update selected genres in the form data
    setFormData({ ...formData, genres });
  };

  // Submit the form data to create a new Manga
  const handleSubmit = async () => {
    try {
      // Thêm thể loại mới nếu cần
      const normalizedAvailableGenres = availableGenres.map((genre) => genre.toLowerCase());
      const newGenres = formData.genres.filter((genre) => !normalizedAvailableGenres.includes(genre.toLowerCase()));
      for (const genreName of newGenres) {
        await addGenre(genreName);
      }

      // Gọi API tạo manga với thể loại đầy đủ
      const result = await createManga(formData);
      toast.success('Manga created successfully!');
      onMangaAdded(result.data);

      handleClose();
    } catch (error) {
      console.error('Error creating manga:', error);
      toast.error('Error creating manga!');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
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

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={availableGenres}
              freeSolo
              value={formData.genres}
              onChange={handleGenresChange}
              renderInput={(params) => <TextField {...params} label="Genres" placeholder="Choose or add genres" />}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox checked={!!formData.is_vip} onChange={handleVipChange} color="primary" />} label="VIP" />
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
