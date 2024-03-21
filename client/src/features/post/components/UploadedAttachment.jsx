import { CloseOutlined } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { memo } from "react";
const UploadedAttachment = memo(function Attachment({ attachment, setAttachment }) {
  const isGif = attachment.type === "gif";
  return (
    <Box className="my-1 w-full max-w-full overflow-hidden">
      <Box className="relative w-full max-w-full">
        {isGif ? (
          <img className="max-w-full rounded-xl object-contain" src={attachment.content} />
        ) : (
          <img
            alt=""
            className="max-h-[400px] max-w-full rounded-xl"
            src={URL.createObjectURL(attachment.content)}
          />
        )}
        <IconButton
          onClick={() => setAttachment(null)}
          disableRipple
          size="small"
          sx={{
            position: "absolute",
            top: "2%",
            right: "2%",
            backgroundColor: "rgba(0,0,0,0.75)",
          }}
        >
          <CloseOutlined sx={{ color: "white" }} />
        </IconButton>
      </Box>
    </Box>
  );
});

export default UploadedAttachment;
