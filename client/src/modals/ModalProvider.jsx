import { useMediaQuery } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import NewPostModal from "src/features/post/components/NewPostModal";
import ProfileSetup from "src/features/profile/components/ProfileSetup";

const modalOptions = {
  reply: <NewPostModal />,
  quote: <NewPostModal />,
  profile_flow: <ProfileSetup />,
};

const ModalProvider = () => {
  const modal = useSelector((state) => state.app.modal);
  const isDesktopScreen = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (modal.enabled && !isDesktopScreen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [modal, isDesktopScreen]);

  return modalOptions[modal.type];
};

export default ModalProvider;
