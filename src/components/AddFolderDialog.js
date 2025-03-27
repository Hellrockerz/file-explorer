"use client";
import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import request from "@/app/api/axiosInstanceFIle";
import "react-toastify/dist/ReactToastify.css";

const AddFolderDialog = ({ open, onClose, parentId, refreshFiles }) => {
    const [folderName, setFolderName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateFolder = async () => {
        if (!folderName.trim()) {
            toast.error("Folder name cannot be empty");
            return;
        }
        setLoading(true);
        try {
            const response = await request.post("/file/createFolder", {
                fileName: folderName,
                parentId: parentId,
                isFile: false,
            });
            toast.success(response.data.message || "Folder created successfully");
            refreshFiles(); // Refresh file tree after folder creation
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to create folder");
        } finally {
            setLoading(false);
            setFolderName("");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Folder Name"
                    type="text"
                    fullWidth
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button onClick={handleCreateFolder} color="primary" disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFolderDialog;
