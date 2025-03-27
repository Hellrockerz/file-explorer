import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import request from "@/app/api/axiosInstanceFIle";
import { toast } from "react-toastify";

const DeleteConfirmationDialog = ({ open, onClose, selectedItem, refreshFiles }) => {
  const handleDelete = async () => {
    if (!selectedItem?._id) return;

    try {
      await request.delete(`/file/deleteFolder/${selectedItem._id}`);
      toast.success(`"${selectedItem.fileName}" deleted successfully`);
      refreshFiles(); // Refresh the file list after deletion
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete file/folder");
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete {selectedItem?.isFile ? "File" : "Folder"}</DialogTitle>
      <DialogContent>
        Are you sure you want to delete &quot;<strong>{selectedItem?.fileName}</strong>&quot;?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={handleDelete} color="error">Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
