"use client";
import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import request from "@/app/api/axiosInstanceFIle";

const RenameDialog = ({ open, onClose, selectedItem, refreshFiles }) => {
  const [newName, setNewName] = useState(selectedItem?.fileName || "");

  const handleRename = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      await request.put(`/file/updateFolder/${selectedItem?._id}`, { fileName: newName });
      toast.success("Folder/File renamed successfully");
      refreshFiles();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to rename");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Rename {selectedItem?.isFile ? "File" : "Folder"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="New Name"
          variant="outlined"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={selectedItem?.fileName}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleRename} color="primary">OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameDialog;
