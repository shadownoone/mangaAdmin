// ChapterDialog.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  IconButton
} from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ChapterDialog = ({ open, onClose, manga, onEditChapter, onDeleteChapter, onAddChapter }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chapter List for {manga?.title}</DialogTitle>
      <DialogContent>
        <Button startIcon={<EditOutlined />} onClick={onAddChapter} sx={{ mb: 2 }}>
          Add Chapter
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Chapter Title</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manga?.chapters.map((chapter, index) => (
              <TableRow key={chapter.chapter_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{chapter.title}</TableCell>
                <TableCell>{chapter.createdAt}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEditChapter(chapter)}>
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => onDeleteChapter(chapter.chapter_id)}>
                      <DeleteOutlined />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChapterDialog;
