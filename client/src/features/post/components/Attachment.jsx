import { Box, useTheme } from "@mui/material";
import { memo } from "react";
const Attachment = memo(function Attachment({ attachment_key, border = true }) {
  const isGif = attachment_key?.includes("giphy");
  const { palette } = useTheme();
  return (
    <>
      {isGif ? (
        <Box className="flex w-full items-center justify-start">
          <img
            style={{
              border: border && `1px solid ${palette.neutral.medium}`,
            }}
            className="my-1 max-h-[600px] max-w-full rounded-xl object-contain"
            src={attachment_key}
          />
        </Box>
      ) : (
        <Box className="flex w-full items-center justify-start">
          <img
            alt=""
            className="my-1 max-h-[600px] max-w-full overflow-hidden rounded-xl object-contain"
            style={{
              border: border && `1px solid ${palette.neutral.medium}`,
            }}
            src={`http://localhost:6001/image/${attachment_key}`}
          />
        </Box>
      )}
    </>
  );
});

export default Attachment;
