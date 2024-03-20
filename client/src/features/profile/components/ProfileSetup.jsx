import { CameraEnhanceOutlined, EditOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { useDispatch, useSelector } from "react-redux";
import logo from "src/assets/logo.svg";
import { handleSetModal } from "src/features/post/store/actions";
import { patchUser } from "src/store/slices/userSlice";
import { useSWRConfig } from "swr";
import EditImage from "../../../components/EditImage";

const ProfileSetup = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const [newUserInfo, setNewUserInfo] = useState({
    profileImage: null,
    bannerImage: null,
    biography: user.biography,
    location: user.location,
  });

  const [currentStep, setCurrentStep] = useState(1);

  const { mutate } = useSWRConfig();
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const isDesktopScreen = useMediaQuery("(min-width: 768px)");

  const handleSaveInfo = () => {
    const formData = new FormData();
    formData.append("profile_image", newUserInfo.profileImage);
    formData.append("banner_image", newUserInfo.bannerImage);
    formData.append("biography", newUserInfo.biography);
    formData.append("location", newUserInfo.location);
    dispatch(patchUser(formData));
    setTimeout(() => mutate([`http://localhost:6001/users/${user.id}`, token]), 1000);
  };

  const setUserProps = {
    newUserInfo,
    setNewUserInfo,
  };

  const currentView = {
    1: <ImageSelectionStep key="user" type="user" {...setUserProps} />,
    2: <ImageSelectionStep key="banner" type="banner" {...setUserProps} />,
    3: <TextEntryStep key="biography" type="biography" {...setUserProps} />,
    4: <TextEntryStep key="location" type="location" {...setUserProps} />,
  };

  return (
    <Dialog fullScreen={!isDesktopScreen} fullWidth open>
      <Box className="grid h-full min-h-[650px] grid-rows-[13%_80%_7%] p-4 md:p-6">
        <img src={logo} className=" mx-auto w-[40px] md:w-[50px]" alt="" />
        <Box className="flex min-h-full flex-col justify-start gap-2">
          {currentView[currentStep]}
        </Box>
        <Button
          sx={{
            backgroundColor: palette.neutral.darkest,
            color: palette.neutral.light,
            borderRadius: "9999px",
            fontSize: "1rem",
            textTransform: "capitalize",
          }}
          onClick={() => {
            if (currentStep === 4) {
              handleSaveInfo();
              handleSetModal({ enabled: false });
            } else setCurrentStep((curr) => (curr += 1));
          }}
        >
          Continue
        </Button>
      </Box>
    </Dialog>
  );
};

const ImageSelectionStep = ({ type, newUserInfo, setNewUserInfo }) => {
  const { palette } = useTheme();
  const { profile_img_key, banner_img_key } = useSelector((state) => state.user.user);
  const [imgSrc, setImgSrc] = useState("");
  const [isEditView, setIsEditView] = useState(false);

  const isUserImage = type === "user";

  const currImgKey = isUserImage ? profile_img_key : banner_img_key;

  const [image, setImage] = useState(`http://localhost:6001/image/${currImgKey}`);

  console.log(image);

  const isImageChanged = newUserInfo.profileImage;

  const handleUpload = async (e) => {
    const reader = new FileReader();
    console.log(e);
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < 100 || naturalHeight < 100) {
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
      setIsEditView(true);
    });
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Box className="min-h-full">
      <Typography variant="h2" fontWeight="800">
        {isUserImage ? "Pick a profile picture" : "Choose a banner image"}
      </Typography>
      <Typography variant="h6" color={palette.neutral.medium}>
        {isUserImage
          ? "Have a favorite selfie? Use it here!"
          : "People who visit your profile will see it. Show your style."}
      </Typography>
      <Box className="relative mx-auto flex h-[80%] w-full items-center justify-center">
        {isEditView ? (
          <EditImage
            imgSrc={imgSrc}
            imageType={isUserImage ? "profileImage" : "bannerImage"}
            setNewUserInfo={setNewUserInfo}
            setNewImage={setImage}
            setIsEditView={setIsEditView}
          />
        ) : (
          <Box position="relative">
            <img
              className="z-10 h-[200px] object-cover"
              style={{
                width: isUserImage ? "200px" : "auto",
                maxWidth: "100%",
                borderRadius: isUserImage ? "50%" : "0px",
                border: `1px solid ${palette.neutral.darkest}`,
              }}
              alt=""
              src={image}
            />

            <Box
              className="absolute left-1/2 top-1/2 z-[100] flex aspect-square w-[50px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              sx={{
                backgroundColor: palette.neutral.light,
                "&:hover": {
                  backgroundColor: palette.neutral.medium,
                },
              }}
            >
              <Box>
                <IconButton disableRipple component="label">
                  {isImageChanged ? (
                    <EditOutlined sx={{ fontSize: "25px" }} />
                  ) : (
                    <CameraEnhanceOutlined sx={{ fontSize: "25px" }} />
                  )}
                  <input accept="image/*" onChange={handleUpload} hidden type="file" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const TextEntryStep = ({ type, setNewUserInfo }) => {
  const { palette } = useTheme();
  const [userInput, setUserInput] = useState("");
  const { location, biography } = useSelector((state) => state.user.user);
  const isBiography = type === "biography";

  const handleUserInput = (e) => {
    if (userInput?.length <= 159) {
      setUserInput(e.target.value);
      setNewUserInfo((curr) => {
        return { ...curr, [type]: e.target.value };
      });
    } else if (e.target.value.length < userInput?.length) {
      setUserInput(e.target.value);
      setNewUserInfo((curr) => {
        return { ...curr, [type]: e.target.value };
      });
    }
  };
  return (
    <>
      <Typography variant="h2" fontWeight="800">
        {isBiography ? "Enter a biography" : "Enter your location"}
      </Typography>
      <Typography variant="h6" color={palette.neutral.medium}>
        {isBiography ? "What do you want to share about yourself?" : "Where are you from?"}
      </Typography>
      <Box className="relative mx-auto mt-8 flex h-full w-full items-start justify-center">
        <Box className="flex w-full flex-col gap-2">
          <TextField
            sx={{
              borderRadius: "10px",
            }}
            fontSize="2rem"
            fullWidth
            multiline
            value={userInput}
            onChange={(e) => handleUserInput(e)}
            placeholder={isBiography ? biography : location}
          />
          {userInput?.length > 1 && (
            <Typography
              marginLeft="auto"
              sx={{
                color: userInput?.length === 160 ? "#dc3545" : palette.neutral.medium,
              }}
            >{`${userInput?.length}/160`}</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ProfileSetup;
