import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IMAGE_URL, BASE_URL } from "../../Utils/appConstants";
import Image from "next/image";

const FilePreviewPopup = ({ open, onClose, file }) => {
  if (!file) return null;

  const getFileViewer = () => {
    if (file.fileExtension === "pdf") {
      return (
        <iframe
          src={`${IMAGE_URL}/${file.location}`}
          title="PDF Preview"
          width="100%"
          height="500px"
          style={{ border: "none" }}
        />
      );
    }
    else if (file.fileExtension === "docx" || file.fileExtension === "doc") {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${IMAGE_URL}/${file.location}&embedded=true`}
          title="Word File Preview"
          width="100%"
          height="500px"
          style={{ border: "none" }}
        />
      );
    }
    else if (file.fileExtension === "jpg" || file.fileExtension === "jpeg" || file.fileExtension === "png") {
      return (
        <Image
          src={`${IMAGE_URL}/${file.location}`}
          alt={file.location}
          width={500}
          height={300}
          layout="responsive"
          unoptimized
          priority={true} // Optional: Helps with LCP optimization
        />
      );
    } else if (file.fileExtension === "txt") {
      return (
        <iframe
          src={`${IMAGE_URL}/${file.location}`}
          title="Text File Preview"
          width="100%"
          height="500px"
          style={{ border: "none" }}
        />
      );
    } else {
      return <Typography variant="body2">File preview is not supported.</Typography>;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {file.name}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 10, top: 10 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{getFileViewer()}</DialogContent>
    </Dialog>
  );
};

export default FilePreviewPopup;
