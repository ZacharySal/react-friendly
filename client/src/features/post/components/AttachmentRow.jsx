import { EmojiEmotionsOutlined, GifBoxOutlined, ImageOutlined } from "@mui/icons-material";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useClickAway } from "@uidotdev/usehooks";
import EmojiPicker from "emoji-picker-react";
import { memo, useState } from "react";
import Tooltip from "src/components/Tooltip";
import GifSelector from "./GifSelector";

const AttachmentRow = memo(function AttachmentRow({ setAttachment, setReply, size = "22px" }) {
  const { palette } = useTheme();
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGifs, setShowGifs] = useState(false);
  const isDesktopScreen = useMediaQuery("(min-width: 768px)");

  const ref = useClickAway(() => {
    setShowEmoji(false);
  });

  const iconStyle = { color: palette.primary.main, fontSize: size };

  return (
    <Box className="flex items-center">
      <Tooltip name="Media">
        <IconButton id="smallRipple" component="label">
          <ImageOutlined fontSize="medium" sx={iconStyle} />
          <input
            accept="image/*"
            onChange={(e) => setAttachment({ content: e.target?.files?.[0], type: "image" })}
            hidden
            type="file"
          />
        </IconButton>
      </Tooltip>
      <Box className="relative">
        <Tooltip name="Emoji">
          <IconButton id="smallRipple" onClick={() => setShowEmoji((curr) => !curr)}>
            <EmojiEmotionsOutlined sx={iconStyle} />
          </IconButton>
        </Tooltip>
        <Box
          sx={{ display: showEmoji ? "block" : "none", zIndex: "200" }}
          position="absolute"
          ref={ref}
          top="35px"
          left={isDesktopScreen ? "0" : "-35px"}
        >
          <EmojiPicker
            open={showEmoji}
            width={"260px"}
            previewConfig={{ showPreview: false }}
            skinTonesDisabled
            emojiStyle="native"
            onEmojiClick={(emoji) => setReply((reply) => (reply += emoji.emoji))}
            theme={palette.mode}
          />
        </Box>
      </Box>
      <Tooltip name="GIF">
        <Box position="relative">
          <IconButton onClick={() => setShowGifs((curr) => !curr)} id="smallRipple">
            <GifBoxOutlined sx={iconStyle} />
          </IconButton>
          {showGifs && (
            <GifSelector close={() => setShowGifs(false)} setAttachment={setAttachment} />
          )}
        </Box>
      </Tooltip>

      {/* <FormatListBulletedOutlined sx={iconStyle} />
      <GifBoxOutlined sx={iconStyle} />
      <EditCalendarOutlined sx={iconStyle} /> */}
    </Box>
  );
});

export default AttachmentRow;
