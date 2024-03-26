import { CameraEnhanceOutlined, EditOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ModalContext } from "contexts/ModalContext";
import { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-image-crop/dist/ReactCrop.css";
import { useDispatch, useSelector } from "react-redux";
import { patchUser } from "store/userSlice";
import EditImage from "./EditImage";

const ProfileSetup = () => {
  const [newUserInfo, setNewUserInfo] = useState({
    profileImage: null,
    bannerImage: null,
    biography: null,
    location: null,
  });

  const [currentStep, setCurrentStep] = useState(0);

  const { setModalContext } = useContext(ModalContext);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const isDesktopScreen = useMediaQuery("(min-width: 700px)");

  const handleSaveInfo = () => {
    const formData = new FormData();
    formData.append("profile_image", newUserInfo.profileImage);
    formData.append("banner_image", newUserInfo.bannerImage);
    formData.append("biography", newUserInfo.biography);
    formData.append("location", newUserInfo.location);
    dispatch(patchUser(formData));
  };

  return (
    <Box
      id="modal"
      position="absolute"
      width={isDesktopScreen ? "600px" : "100vw"}
      height={isDesktopScreen ? "600px" : "100vh"}
      top={isDesktopScreen ? "50%" : "0"}
      borderRadius={isDesktopScreen ? "10px" : "0px"}
      backgroundColor={palette.background.default}
      padding="1.25rem 4rem"
      left={isDesktopScreen ? "50%" : "0"}
      zIndex="100"
      boxShadow="0px 0px 100px 2000px rgba(200,200,255,0.15)"
      sx={{ transform: isDesktopScreen ? "translateX(-50%) translateY(-50%)" : "" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        gap="1.5rem"
        height="100%"
      >
        <img style={{ width: "40px" }} alt="" src="../assets/logo.svg"></img>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          width="100%"
          gap="0.5rem"
          flexBasis="80%"
        >
          {currentStep === 0 && (
            <ImageSelection newUserInfo={newUserInfo} setNewUserInfo={setNewUserInfo} />
          )}
          {currentStep === 1 && (
            <BannerSelection newUserInfo={newUserInfo} setNewUserInfo={setNewUserInfo} />
          )}
          {currentStep === 2 && <BiograpySelection setNewUserInfo={setNewUserInfo} />}
          {currentStep === 3 && <LocationSelection setNewUserInfo={setNewUserInfo} />}
        </Box>
        <Button
          onClick={() => {
            if (currentStep === 3) {
              handleSaveInfo();
              setModalContext({ show: false });
            } else setCurrentStep((curr) => (curr += 1));
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

const ImageSelection = ({ newUserInfo, setNewUserInfo }) => {
  const { palette } = useTheme();
  const { profile_img_key } = useSelector((state) => state.user.user);

  const [imgSrc, setImgSrc] = useState("");
  const [isEditView, setIsEditView] = useState(false);

  const [userProfileImage, setUserProfileImage] = useState(
    `http://localhost:6001/posts/image/${profile_img_key}`
  );

  const isImageChanged = newUserInfo.profileImage;

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
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
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <Typography variant="h2" fontWeight="800">
        Pick a profile picture
      </Typography>
      <Typography variant="h6" color={palette.neutral.medium}>
        Have a favorite selfie? Use it here!
      </Typography>
      <Box
        margin="0rem auto 0rem auto"
        display="flex"
        position="relative"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
      >
        {isEditView ? (
          <EditImage
            imgSrc={imgSrc}
            imageType={"profileImage"}
            setNewUserInfo={setNewUserInfo}
            setNewImage={setUserProfileImage}
            setIsEditView={setIsEditView}
          />
        ) : (
          <Box display="flex" flexDirection="column" gap="1rem">
            <Box position="relative">
              <img
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: `3px solid ${palette.neutral.main}`,
                  zIndex: "10",
                }}
                width="200px"
                height="200px"
                alt="your current profile picture"
                src={userProfileImage}
              />
              <Box
                sx={{
                  position: "absolute",
                  width: "50px",
                  height: "50px",
                  top: "50%",
                  left: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "100vw",
                  transform: "translateX(-50%) translateY(-50%)",
                  zIndex: "100",
                  backgroundColor: palette.neutral.light,
                  "&:hover": {
                    backgroundColor: palette.neutral.medium,
                  },
                }}
              >
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <IconButton disableRipple>
                    {isImageChanged ? (
                      <EditOutlined sx={{ fontSize: "25px" }} />
                    ) : (
                      <CameraEnhanceOutlined sx={{ fontSize: "25px" }} />
                    )}
                  </IconButton>
                </div>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

const BannerSelection = ({ newUserInfo, setNewUserInfo }) => {
  const { palette } = useTheme();
  const { banner_img_key } = useSelector((state) => state.user.user);
  const [imgSrc, setImgSrc] = useState("");
  const [isEditView, setIsEditView] = useState(false);
  const [bannerImage, setBannerImage] = useState(
    `http://localhost:6001/posts/image/${banner_img_key}`
  );

  const isImageChanged = newUserInfo.profileImage;

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
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
        console.log(imageUrl.substring(0, 20));
        setImgSrc(imageUrl);
        setIsEditView(true);
      });
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <>
      <Typography variant="h2" fontWeight="800">
        Pick a header
      </Typography>
      <Typography variant="h6" color={palette.neutral.medium}>
        People who visit your profile will see it. Show your style.
      </Typography>
      <Box
        margin="0rem auto 0rem auto"
        display="flex"
        position="relative"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
      >
        {isEditView ? (
          <EditImage
            imgSrc={imgSrc}
            aspect={3 / 1}
            imageType={"bannerImage"}
            minWidth={300}
            setNewImage={setBannerImage}
            setNewUserInfo={setNewUserInfo}
            setIsEditView={setIsEditView}
          />
        ) : (
          <Box display="flex" flexDirection="column" gap="1rem">
            <Box position="relative">
              <img
                style={{
                  objectFit: "cover",
                  maxWidth: "100%",
                  zIndex: "10",
                }}
                height="200px"
                alt="your current banner image"
                src={bannerImage}
              />
              <Box
                sx={{
                  position: "absolute",
                  width: "50px",
                  height: "50px",
                  top: "50%",
                  left: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "100vw",
                  transform: "translateX(-50%) translateY(-50%)",
                  zIndex: "100",
                  backgroundColor: palette.neutral.light,
                  "&:hover": {
                    backgroundColor: palette.neutral.medium,
                  },
                }}
              >
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <IconButton disableRipple>
                    {isImageChanged ? (
                      <EditOutlined sx={{ fontSize: "25px" }} />
                    ) : (
                      <CameraEnhanceOutlined sx={{ fontSize: "25px" }} />
                    )}
                  </IconButton>
                </div>
              </Box>
            </Box>
            {/* <Button focusRipple={false} disableRipple>
              <Box
                display="flex"
                color={palette.neutral.medium}
                alignItems="center"
                justifyContent="center"
                gap="0.2rem"
              >
                <UndoOutlined />
                <Typography>Undo</Typography>
              </Box>
            </Button> */}
          </Box>
        )}
      </Box>
    </>
  );
};

const BiograpySelection = ({ setNewUserInfo }) => {
  const { palette } = useTheme();
  const [userInput, setUserInput] = useState("");

  const handleUserInput = (e) => {
    if (userInput.length <= 159) {
      setUserInput(e.target.value);
      setNewUserInfo((curr) => {
        return { ...curr, biography: e.target.value };
      });
    } else if (e.target.value.length < userInput.length) {
      setUserInput(e.target.value);
      setNewUserInfo((curr) => {
        return { ...curr, biography: e.target.value };
      });
    }
  };
  return (
    <>
      {/* <img src={"http://localhost:6001/posts/image/6b21997895b41304b453023bdce53f6c"}></img> */}
      <Typography variant="h2" fontWeight="800">
        Enter a biography
      </Typography>
      <Typography variant="h6" color={palette.neutral.medium}>
        What do you want to share about yourself?
      </Typography>
      <Box
        margin="2rem auto 0rem auto"
        display="flex"
        position="relative"
        justifyContent="center"
        alignItems="flex-start"
        height="100%"
        width="100%"
      >
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: "0.5rem" }}>
          <TextField
            sx={{
              borderRadius: "10px",
            }}
            fontSize="2rem"
            fullWidth
            multiline
            value={userInput}
            onChange={(e) => handleUserInput(e)}
            placeholder={``}
          />
          {userInput.length > 1 && (
            <Typography
              marginLeft="auto"
              sx={{ color: userInput.length == 160 ? "#dc3545" : palette.neutral.medium }}
            >{`${userInput.length}/160`}</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

const LocationSelection = ({ setNewUserInfo }) => {
  const { palette } = useTheme();
  const [userInput, setUserInput] = useState("");

  const handleUserInput = (e) => {
    if (userInput.length <= 29) {
      setUserInput(e.target.value);
      setNewUserInfo((curr) => {
        return { ...curr, location: e.target.value };
      });
    } else if (e.target.value.length < userInput.length) {
      setUserInput(e.target.value);
      setNewUserInfo((curr) => {
        return { ...curr, location: e.target.value };
      });
    }
  };
  return (
    <>
      <Typography variant="h2" fontWeight="800">
        Enter your location
      </Typography>
      <Typography variant="h6" color={palette.neutral.medium}>
        Where are you from?
      </Typography>
      <Box
        margin="2rem auto 0rem auto"
        display="flex"
        position="relative"
        justifyContent="center"
        alignItems="flex-start"
        height="100%"
        width="100%"
      >
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: "0.5rem" }}>
          <TextField
            sx={{
              borderRadius: "10px",
            }}
            fontSize="2rem"
            fullWidth
            multiline
            value={userInput}
            onChange={(e) => handleUserInput(e)}
            placeholder={``}
          />
          {userInput.length > 1 && (
            <Typography
              marginLeft="auto"
              sx={{ color: userInput.length == 30 ? "#dc3545" : palette.neutral.medium }}
            >{`${userInput.length}/30`}</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ProfileSetup;
