import { Box, useTheme } from "@mui/material";
import PostTypeOption from "./PostTypeOption";

const PostTypeSelector = ({ selectedType, setSelectedType }) => {
  const allPostTypes = ["posts", "replies", "reposts", "media"];
  const { palette } = useTheme();
  return (
    <Box className="mt-2" borderBottom={`1px solid ${palette.neutral.light}`}>
      <Box className="flex justify-evenly">
        {allPostTypes.map((type) => (
          <PostTypeOption
            key={type}
            type={type}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PostTypeSelector;
