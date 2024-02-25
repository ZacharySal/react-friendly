// color design tokens export
export const colorTokens = {
  grey: {
    0: "#FFFFFF", // white
    10: "#F6F6F6", // less white
    50: "#F0F0F0",
    100: "#E0E0E0", // lesser white
    200: "#C2C2C2",
    300: "#A3A3A3",
    400: "#858585", // gray
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A", //dark gray
    900: "#0A0A0A",
    1000: "#000000", // black
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: "#1DA1F2",
            },
            neutral: {
              darkest: colorTokens.grey[0],
              dark: colorTokens.grey[100], // lesser wwhite
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[300],
              medium: colorTokens.grey[400],
              light: colorTokens.grey[700], // dark gray
              lighter: colorTokens.grey[800],
              lightest: colorTokens.grey[1000],
            },
            background: {
              default: colorTokens.grey[900], // black
              alt: colorTokens.grey[800], // less black
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: "#1DA1F2",
            },
            neutral: {
              lightest: colorTokens.grey[0],
              lighter: colorTokens.grey[100],
              light: colorTokens.grey[100], // lesser white
              medium: colorTokens.grey[300],
              mediumMain: colorTokens.grey[400], //gray
              main: colorTokens.grey[600],
              dark: colorTokens.grey[700], // dark gray
              darkest: colorTokens.grey[1000],
            },
            background: {
              default: colorTokens.grey[10], // less white
              alt: colorTokens.grey[0], // white
            },
          }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 15,
        fontWeight: 400,
      },
      h7: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 14,
      },
      h8: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 12,
      },
    },
  };
};
