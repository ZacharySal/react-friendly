import { CancelOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { useRef, useState } from "react";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";

const EditImage = ({
  imgSrc,
  imageType,
  aspect = 1,
  minWidth = 300,
  setNewUserInfo,
  setNewImage,
  setIsEditView,
}) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState();

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (minWidth / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      aspect,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "50px 1fr",
        minWidth: "100%",
        height: "100%",
        marginBottom: "auto",
      }}
    >
      <FlexBetween>
        <Box display="flex" alignItems="center" gap="0.5rem">
          <IconButton onClick={() => setIsEditView(false)}>
            <CancelOutlined />
          </IconButton>
          <Typography fontWeight="600">Edit Media</Typography>
        </Box>
        <Button
          onClick={() => {
            setCanvasPreview(
              imgRef.current,
              previewCanvasRef.current,
              convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
            );
            const dataUrl = previewCanvasRef.current.toDataURL();
            setNewUserInfo((curr) => {
              return { ...curr, [imageType]: dataUrl };
            });
            setIsEditView(false);
            setNewImage(dataUrl);
          }}
        >
          Apply
        </Button>
      </FlexBetween>
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <ReactCrop
          style={{ maxHeight: "300px" }}
          locked
          crop={crop}
          aspect={aspect}
          onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
          keepSelection
          ruleOfThirds
          //   onComplete={(c) => handleImageChange(c)}
        >
          <img src={imgSrc} ref={imgRef} onLoad={onImageLoad} />
        </ReactCrop>
        {crop && (
          <canvas
            ref={previewCanvasRef}
            style={{
              display: "none",
              marginTop: "1rem",
              border: "1px solid black",
              objectFit: "contain",
              width: 150,
              height: 150,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

const setCanvasPreview = (
  image, // HTMLImageElement
  canvas, // HTMLCanvasElement
  crop // PixelCrop
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";
  ctx.save();

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  // Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);

  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
};

export default EditImage;
