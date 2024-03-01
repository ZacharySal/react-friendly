import { createContext, useState } from "react";

const initalValue = {
  show: false,
  type: "none",
};

export const ModalContext = createContext(initalValue);

const ModalContextProvider = ({ children }) => {
  const [modalContext, setModalContext] = useState(initalValue);
  return (
    <ModalContext.Provider value={{ modalContext, setModalContext }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
