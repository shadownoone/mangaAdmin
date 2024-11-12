// ChapterFormDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const ChapterFormDialog = ({ open, onClose, onSave, chapterTitle, setChapterTitle, chapterNumber, setChapterNumber }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{chapterTitle ? 'Edit Chapter' : 'Add Chapter'}</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Chapter Title" value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} sx={{ mb: 2 }} />
        <TextField
          fullWidth
          label="Chapter Number"
          value={chapterNumber}
          onChange={(e) => setChapterNumber(e.target.value)}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          {chapterTitle ? 'Save Changes' : 'Add Chapter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChapterFormDialog;
