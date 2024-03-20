import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import LoadingAnimation from "src/components/LoadingAnimation";
import Attachment from "src/features/post/components/Attachment";
import useSWR from "swr";

const fetcher = async (params) => {
  const [url, token] = params;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return data;
};

const UserMedia = ({ user_id }) => {
  const token = useSelector((state) => state.user.token);
  const key = `http://192.168.1.247:6001/users/${user_id}/media`;
  const { data: media, isLoading } = useSWR([key, token], fetcher);
  return (
    <>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <Box className="p-2 gap-1 grid grid-cols-3">
          {media.map((media_key) => (
            <Attachment key={media_key} attachment_key={media_key} border={false} />
          ))}
        </Box>
      )}
    </>
  );
};

export default UserMedia;
