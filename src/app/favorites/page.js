"use client"
import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Grid, IconButton } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import FilePreviewPopup from "@/components/FilePreviewPopup";
import request from '@/app/api/axiosInstanceFIle';

import { toast } from "react-toastify";

const getFileIcon = (type) => {
  switch (type) {
    case "pdf":
      return <PictureAsPdfIcon color="error" fontSize="large" />;
    case "jpg":
      return <ImageIcon color="primary" fontSize="large" />;
    case "jpeg":
      return <ImageIcon color="primary" fontSize="large" />;
    case "png":
      return <ImageIcon color="primary" fontSize="large" />;
    case "doc":
      return <DescriptionIcon color="secondary" fontSize="large" />;
    case "docx":
      return <DescriptionIcon color="secondary" fontSize="large" />;
    case "ppt":
      return <InsertDriveFileIcon color="warning" fontSize="large" />;
    case "pptx":
      return <InsertDriveFileIcon color="warning" fontSize="large" />;
    default:
      return <InsertDriveFileIcon fontSize="large" />;
  }
};

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await request.get("/file/getFavorites");
      setFavorites(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch favorites");
    }
  };

  const handleOpenPreview = (file) => {
    setSelectedFile(file);
    setOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Favorites
      </Typography>
      <Grid container spacing={2}>
        {favorites.map((file) => (
          <Grid item xs={12} sm={6} md={4} key={file._id}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2, cursor: "pointer" }} onClick={() => handleOpenPreview(file)}>
              {getFileIcon(file.fileExtension)}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{file.fileName}</Typography>
              </CardContent>
              <IconButton color="error">
                <DeleteIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
      <FilePreviewPopup open={open} onClose={() => setOpen(false)} file={selectedFile} />
    </Box>
  );
};

export default Favorites;
