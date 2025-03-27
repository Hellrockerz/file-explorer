"use client";
import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Menu,
  MenuItem,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DeleteIcon from "@mui/icons-material/Delete";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import AddFolderDialog from "./AddFolderDialog.js";
import UploadFileDialog from "./UploadFileDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog.js";
import RenameDialog from "./RenameDialog.js";
import FilePreviewPopup from "./FilePreviewPopup";
import { toast } from "react-toastify";
import request from "@/app/api/axiosInstanceFIle";
import "react-toastify/dist/ReactToastify.css";
import { IMAGE_URL } from "../../Utils/appConstants.js";

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

const FileTree = () => {
  const [files, setFiles] = useState([]);
  const [openFolders, setOpenFolders] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await request.get("/file/getFolders");
      setFiles(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch files");
    }
  };

  const toggleFolder = (id) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openDialog = (type) => {
    setDialogType(type);
    setSelectedParentId(selectedItem?._id || null);

    if (type === "rename") {
      setRenameDialogOpen(true);
    } else {
      handleMenuClose();
    }
  };

  const closeDialog = () => {
    setDialogType(null);
    setSelectedParentId(null);
  };

  const toggleFavorite = async (id) => {
    try {
      await request.put(`/file/markFavorites/${id}`);

      setFiles((prevFiles) => {
        const updateFavorites = (files) => {
          return files.map((file) => {
            if (file._id === id) {
              return { ...file, isFavorite: !file.isFavorite };
            } else if (file.children && file.children.length > 0) {
              return { ...file, children: updateFavorites(file.children) };
            }
            return file;
          });
        };

        return updateFavorites(prevFiles);
      });

      toast.success("Favorite status updated");
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  const handleFileClick = (file) => {
    if (file.isFile) {
      setPreviewFile(file);
    }
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const renderTree = (items, level = 0) => {
    return (
      <List component="div" disablePadding>
        {items.map((item) => (
          <div key={item._id}>
            <ListItem
              sx={{ pl: level * 2, cursor: "pointer" }}
              onClick={() => {
                if (!item.isFile) {
                  toggleFolder(item._id);
                } else {
                  handleFileClick(item);
                }
              }}
            >
              {item.isFile === false && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(item._id);
                  }}
                >
                  {openFolders[item._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
              <ListItemIcon>{item.isFile ? getFileIcon(item.fileExtension) : <FolderIcon />}</ListItemIcon>
              <ListItemText primary={item.fileName} />
              {item.isFile && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item._id);
                  }}
                >
                  {item.isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
                </IconButton>
              )}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, item);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </ListItem>
            {item.children && item.children.length > 0 && (
              <Collapse in={openFolders[item._id]} timeout="auto" unmountOnExit>
                {renderTree(item.children, level + 1)}
              </Collapse>
            )}
          </div>
        ))}
      </List>
    );
  };

  return (
    <>
      {renderTree(files)}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedItem?.isFile === false && (
          <MenuItem onClick={() => openDialog("addFolder")}>
            <CreateNewFolderIcon /> Add Folder
          </MenuItem>
        )}
        {selectedItem?.isFile === false && (
          <MenuItem onClick={() => openDialog("uploadFile")}>
            <UploadFileIcon /> Upload File
          </MenuItem>
        )}
        <MenuItem onClick={() => openDialog("rename")}>
          <EditIcon /> Rename
        </MenuItem>
        <MenuItem onClick={() => openDialog("delete")}>
          <DeleteIcon /> Delete {selectedItem?.isFile === false ? "Folder" : "File"}
        </MenuItem>
      </Menu>

      <AddFolderDialog open={dialogType === "addFolder"} onClose={closeDialog} parentId={selectedParentId} refreshFiles={fetchFiles} />
      <UploadFileDialog open={dialogType === "uploadFile"} onClose={closeDialog} parentId={selectedParentId} refreshFiles={fetchFiles} />
      <DeleteConfirmationDialog open={dialogType === "delete"} onClose={closeDialog} selectedItem={selectedItem} refreshFiles={fetchFiles} />
      <RenameDialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} selectedItem={selectedItem} refreshFiles={fetchFiles} />
      {/* File Preview Popup */}
      <FilePreviewPopup open={!!previewFile} onClose={closePreview} file={previewFile} />
    </>
  );
};

export default FileTree;
