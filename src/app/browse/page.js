import FileTree from "@/components/FileTree";
import { Box } from "@mui/material";

export default function Browse() {
  return (
    <Box sx={{ p: 3 }}>
      <div className="flex" >
        <div className="p-4 w-full">
          <h2 className="text-2xl font-bold">File Manager</h2>
          <FileTree />
        </div>
      </div>
    </Box>

  );
}
