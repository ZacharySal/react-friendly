import { CachedOutlined } from "@mui/icons-material";
import { Box, List, ListItem, ListItemButton, Typography, useTheme } from "@mui/material";
import { useClickAway } from "@uidotdev/usehooks";
import { useState } from "react";
import PostStatistic from "./PostStatistic";

const RepostButton = ({ repostCount, handleQuoteClick, handleRepostClick }) => {
  const { palette } = useTheme();
  const [showSelection, setShowSelection] = useState(false);

  const ref = useClickAway(() => {
    setShowSelection(false);
  });

  return (
    <Box position="relative">
      <PostStatistic
        hoverColor={"rgb(0,186,124)"}
        name="Repost"
        onClick={(e) => {
          e.stopPropagation();
          setShowSelection(true);
        }}
      >
        <CachedOutlined sx={{ color: palette.neutral.medium, fontSize: "18px" }} />
        <Typography marginLeft="0.35rem" color={palette.neutral.medium}>
          {repostCount || 0}
        </Typography>
      </PostStatistic>
      {showSelection && (
        <Box
          position="absolute"
          id="modal"
          borderRadius="10px"
          ref={ref}
          backgroundColor={palette.background.default}
          boxShadow="0px 0px 5px 2px rgba(255,255,255,0.4)"
          left={"0"}
          top={"0"}
          zIndex="40"
          p="0"
        >
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton onClick={handleRepostClick}>
                <Typography variant="h6" fontWeight="500">
                  Repost
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleQuoteClick}>
                <Typography variant="h6" fontWeight="500">
                  Quote
                </Typography>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      )}
    </Box>
  );
};

export default RepostButton;
