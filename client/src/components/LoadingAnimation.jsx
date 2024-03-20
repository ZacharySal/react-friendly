import { Oval } from "react-loader-spinner";
const LoadingAnimation = () => {
  return (
    <Oval
      visible={true}
      height="50"
      width="50"
      color="#1DA1F2"
      secondaryColor="#FAFAFA"
      ariaLabel="oval-loading"
      wrapperStyle={{}}
      wrapperClass="min-w-full min-h-[300px] flex justify-center items-center"
    />
  );
};

export default LoadingAnimation;
