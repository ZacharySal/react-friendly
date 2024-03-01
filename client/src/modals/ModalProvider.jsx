import { ModalContext } from "contexts/ModalContext";
import { useContext } from "react";
import NewPostModal from "./NewPostModal";
import ProfileSetup from "./ProfileSetup";

const modalOptions = {
  reply: <NewPostModal />,
  quote: <NewPostModal />,
  profile_flow: <ProfileSetup />,
};

const ModalProvider = () => {
  const { modalContext } = useContext(ModalContext);

  return modalOptions[modalContext.type];
};

export default ModalProvider;
