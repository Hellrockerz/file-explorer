import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
import request from "@/app/api/axiosInstanceFIle";

const UploadFileDialog = ({ open, onClose, parentId, refreshFiles }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    validateFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    validateFile(droppedFile);
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedExtensions = ["jpg", "jpeg", "png", "ppt", "pptX", "pdf", "txt", "doc", "docx"];
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      setError("Only JPG, JPEG, PNG, PPT, PPTX, PDF, DOC, DOCX and TXT files are allowed.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should not exceed 5MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(""); // Clear any previous errors
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("parentId", parentId || "root");
    formData.append("isFile", true);
    try {
      await request.post("/file/createFolder", formData, {}, {
        "Content-Type": "multipart/form-data"
      });
      toast.success("File uploaded successfully");
      refreshFiles();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "File upload failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>Upload File</DialogTitle>
      <DialogContent dividers>
        {/* Drag and Drop Area */}
        <Box
          sx={{
            border: "2px dashed gray",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: dragging ? "#f5f5f5" : "transparent",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload" style={{ display: "block", cursor: "pointer" }}>
            <Button variant="contained" component="span">
              Choose A File
            </Button>
          </label>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {file ? file.name : "No file chosen"}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Or drag and drop a file here
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Typography color="error" sx={{ textAlign: "center", fontSize: "14px", mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleUpload} color="primary" variant="contained" disabled={!file}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadFileDialog;