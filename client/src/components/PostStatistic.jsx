import { IconButton, Tooltip } from "@mui/material";
import { hoverEffectCSS } from "helpers/utils";

const PostStatistic = ({ hoverColor, name, onClick, children }) => {
  return (
    <Tooltip
      enterNextDelay={500}
      title={name}
      fontWeight="800"
      sx={{ fontWeight: "800" }}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [-5, -10],
              },
            },
          ],
        },
        tooltip: {
          sx: {
            color: "white",
            fontWeight: "800",
            fontSize: "11px",
          },
        },
      }}
    >
      <IconButton sx={hoverEffectCSS(hoverColor)} onClick={onClick} disableRipple>
        {children}
      </IconButton>
    </Tooltip>
  );
};

export default PostStatistic;
