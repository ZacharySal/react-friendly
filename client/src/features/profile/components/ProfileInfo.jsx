import {
  CalendarMonthOutlined,
  PersonRemoveAlt1Outlined,
  PersonRemoveOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useClickAway } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionButton from "src/components/ActionButton";
import { handleSetModal } from "src/features/post/store/actions";
import { patchFollow } from "src/store/slices/userSlice";
import { API_URL } from "src/utils/misc";
import FlexBetween from "../../../components/FlexBetween";

const ProfileInfo = ({ user }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user.user);
  const id = loggedUser.id;
  const [showUnfollow, setShowUnfollow] = useState(false);

  const isSelf = id === user.id;
  const isFollowing = useMemo(
    () =>
      Boolean(loggedUser.following?.find((relationship) => relationship.followee_id === user.id)),
    [user, loggedUser]
  );

  const ref = useClickAway(() => {
    setShowUnfollow(false);
  });

  return (
    <Box display="flex" flexDirection="column">
      <img
        alt=""
        src={`${API_URL}/image/${user.banner_img_key}`}
        style={{ maxWidth: "100%", maxHeight: "160px", objectFit: "cover" }}
      />
      <Box className="px-2 md:px-4">
        <FlexBetween marginTop="-0.8rem">
          <Box height="80px" width="80px" position="relative" borderRadius="100vw">
            <Box
              sx={{ position: "absolute", top: "-20px" }}
              borderRadius="100vw"
              width="100%"
              height="100%"
              backgroundColor={palette.background.default}
            />
            <img
              src={`${API_URL}/image/${user.profile_img_key}`}
              alt=""
              className="absolute left-0 top-[-20px] h-[80px] w-[80px] rounded-full object-cover"
              style={{
                border: `2px solid ${palette.background.default}`,
              }}
            />
          </Box>
          {!isFollowing ? (
            <ActionButton
              handleClick={() => {
                isSelf
                  ? handleSetModal({ enabled: true, type: "profile_flow" })
                  : dispatch(patchFollow(user.id));
              }}
              disabled={false}
              backgroundColor={palette.neutral.darkest}
              textColor={palette.neutral.light}
              text={
                isSelf ? (user.biography === "null" ? "Set up profile" : "Edit Profile") : "Follow"
              }
            />
          ) : (
            <IconButton
              onClick={() => setShowUnfollow((curr) => !curr)}
              sx={{
                border: `1px solid ${palette.primary.main}`,
                position: "relative",
                height: "40px",
                aspectRatio: "1",
              }}
            >
              <PersonRemoveOutlined sx={{ fontSize: "20px", color: palette.primary.main }} />
              {showUnfollow && (
                <Box
                  position="absolute"
                  ref={ref}
                  borderRadius="10px"
                  color={palette.neutral.darkest}
                  sx={{
                    boxShadow: `0px 0px 5px 2px ${palette.neutral.dark}50`,
                  }}
                  backgroundColor={palette.background.default}
                  right={"15px"}
                  whiteSpace={"nowrap"}
                  top={"0px"}
                  zIndex="40"
                  p="0"
                >
                  <List disablePadding>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => dispatch(patchFollow(user.id))}
                        sx={{
                          display: "flex",
                          gap: "0.25rem",
                          alignItems: "center",
                        }}
                      >
                        <PersonRemoveAlt1Outlined className="mr-2" />
                        <Typography variant="h5" fontWeight="600">
                          {`Unfollow @${user.display_name}`}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
              )}
            </IconButton>
          )}
        </FlexBetween>
        <Typography variant="h3" fontWeight="600">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="h5" color={palette.neutral.medium}>
          @{user.display_name}
        </Typography>
        <Box className="mt-3 flex flex-col gap-2 md:mt-4">
          <Typography variant="h5">
            {user.biography ?? `${user.first_name} has not introduced themselves yet!`}
          </Typography>
          <Box className="flex gap-2">
            <Box sx={{ color: palette.neutral.medium }} className="flex items-center gap-1">
              <CalendarMonthOutlined />
              <Typography variant="h6">
                {`Joined ${new Date(user.created_at).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`}
              </Typography>
            </Box>
            {user.location && (
              <Box sx={{ color: palette.neutral.medium }} className="flex items-center gap-1">
                <PlaceOutlined />
                <Typography variant="h6">{user.location}</Typography>
              </Box>
            )}
          </Box>

          <Box display="flex" alignItems="center" gap="1rem">
            <Typography variant="h6" fontWeight="600">
              {`${user?.followers?.length ?? 0} `}
              <span style={{ color: palette.neutral.medium, fontWeight: "400" }}>Followers</span>
            </Typography>
            <Typography variant="h6" fontWeight="600">
              {`${user?.following?.length ?? 0} `}
              <span style={{ color: palette.neutral.medium, fontWeight: "400" }}>Following</span>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileInfo;
