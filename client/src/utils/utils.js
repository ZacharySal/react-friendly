export const hoverEffectCSS = (color) => {
  return {
    "&:hover > *": {
      transition: "color 0.3s ease",
      color: `${color} !important`,
    },
  };
};

export const getDateAndTime = (created_at) => {
  const time = new Date(created_at).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
  });

  const date = new Date(created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return { time, date };
};
