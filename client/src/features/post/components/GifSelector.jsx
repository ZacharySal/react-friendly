import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import { CloseOutlined } from "@mui/icons-material";
import { Box, Dialog, IconButton, Input, useMediaQuery, useTheme } from "@mui/material";
import { useClickAway } from "@uidotdev/usehooks";
import { useState } from "react";

const gf = new GiphyFetch("241qfd6ECsxVtqt3ipmeHQ22PmSh7iMA");

const GifSelector = ({ close, setAttachment }) => {
  const isDesktopScreen = useMediaQuery("(min-width: 768px)");
  const [searchTerm, setSearchTerm] = useState("");
  const { palette } = useTheme();

  const fetchGifs = (offset) =>
    searchTerm ? gf.search(searchTerm, { offset, limit: 10 }) : gf.trending({ offset, limit: 10 });

  const ref = useClickAway(() => {
    close();
  });

  return (
    <Dialog ref={ref} fullScreen={!isDesktopScreen} open>
      <Box className="flex flex-col gap-3 p-3">
        <Box className="flex w-full items-center justify-start gap-4">
          <IconButton onClick={close}>
            <CloseOutlined sx={{ fontSize: "22px" }} />
          </IconButton>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disableUnderline
            placeholder="Search for GIFs"
            sx={{ border: `2px solid ${palette.primary.main}` }}
            className="grow rounded-full px-3 py-1"
          />
        </Box>
        <Grid
          width={isDesktopScreen ? 600 : window.innerWidth}
          columns={4}
          gutter={1}
          hideAttribution={true}
          noLink={true}
          onGifClick={(gif) => {
            setAttachment({ content: gif.images.original.url, type: "gif" });
            close();
          }}
          fetchGifs={fetchGifs}
          key={searchTerm}
        />
      </Box>
    </Dialog>
  );
};

export default GifSelector;
