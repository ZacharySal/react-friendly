import { Box, IconButton } from "@mui/material";
import Tooltip from "src/components/Tooltip";
import { hoverEffectCSS } from "src/utils/misc";

const PostStatistic = ({ hoverColor, name, onClick, children }) => {
  return (
    <Box onClick={onClick}>
      <Tooltip name={name}>
        <IconButton sx={{ ...hoverEffectCSS(hoverColor), padding: "0.15rem" }} disableRipple>
          {children}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default PostStatistic;
