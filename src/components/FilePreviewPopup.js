import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PDFDocument, rgb } from "pdf-lib";
import { IMAGE_URL } from "../../Utils/appConstants";
import Image from "next/image";

const FilePreviewPopup = ({ open, onClose, file, handleUpload }) => {
  const [pdfBytes, setPdfBytes] = useState(null);

  if (!file) return null;

  const handleEditPdf = async () => {
    try {
      const existingPdfBytes = await fetch(`${IMAGE_URL}/${file.location}`).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      firstPage.drawText("Edited with pdf-lib!", {
        x: 50,
        y: firstPage.getHeight() - 50,
        size: 30,
        color: rgb(1, 0, 0),
      });

      const updatedPdfBytes = await pdfDoc.save();
      setPdfBytes(updatedPdfBytes);
    } catch (error) {
      console.error("Error editing PDF:", error);
    }
  };

  const handleSavePdf = async () => {
    if (!pdfBytes) return;

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const updatedFile = new File([blob], file.name, { type: "application/pdf" });

    await handleUpload(updatedFile);
    onClose();
  };

  const getFileViewer = () => { 
    if (file.fileExtension === "pdf") {
      return (
        <>
          <iframe
            src={pdfBytes ? URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" })) : `${IMAGE_URL}/${file.location}`}
            title="PDF Preview"
            width="100%"
            height="500px"
            style={{ border: "none" }}
          />
          <Button onClick={handleEditPdf} variant="contained" color="primary" style={{ margin: "10px" }}>
            Edit PDF
          </Button>
          {pdfBytes && (
            <Button onClick={handleSavePdf} variant="contained" color="secondary" style={{ margin: "10px" }}>
              Save Edited PDF
            </Button>
          )}
        </>
      );
    } else if (["docx", "doc"].includes(file.fileExtension)) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${IMAGE_URL}/${file.location}&embedded=true`}
          title="Word File Preview"
          width="100%"
          height="500px"
          style={{ border: "none" }}
        />
      );
    } else if (["jpg", "jpeg", "png"].includes(file.fileExtension)) {
      return (
        <Image
          src={`${IMAGE_URL}/${file.location}`}
          alt={file.location}
          width={500}
          height={300}
          layout="responsive"
          unoptimized
          priority
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
