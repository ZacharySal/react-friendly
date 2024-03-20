import { Tooltip as MUIToolTip } from "@mui/material";

const Tooltip = ({ name, children }) => {
  return (
    <MUIToolTip
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
            padding: "4px 6px",
          },
        },
      }}
    >
      {children}
    </MUIToolTip>
  );
};

export default Tooltip;
