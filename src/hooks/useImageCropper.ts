'use client';
import { useRef, useState } from 'react';
import { Crop } from 'react-image-crop';
import { CroppedImage } from 'types/types';
import { uploadPhotosToBackend } from 'utils/helperFunctions';

const useImageCropper = () => {
  const [isCropModalVisible, setIsCropModalVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleCropClick = (imgUrl: string) => {
    setImageSrc(imgUrl);
    setIsCropModalVisible(true);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspectRatio = 16 / 9;
    const newCrop: Crop = {
      unit: 'px',
      width: width * 0.8,
      height: (width * 0.8) / aspectRatio,
      x: width * 0.1,
      y: height * 0.1
    };
    setCrop(newCrop);
  };

  const onCropComplete = (crop: Crop) => {
    const image = imgRef.current;
    if (!image || !crop.width || !crop.height) return;

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    setCroppedImage(base64Image);
  };

  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCropModalOk = async (
    onUpload: (_newImg: CroppedImage, _originalSrc: string) => void
  ) => {
    if (!croppedImage || !imageSrc) return;

    try {
      const file = base64ToFile(croppedImage, `cropped_${Date.now()}.jpg`);
      const response = await uploadPhotosToBackend([file]);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const uploadedImageUrl = response[0].imageUrl.startsWith('http')
        ? response[0].imageUrl
        : `${baseUrl}${response[0].imageUrl}`;

      const newImage = {
        imageUrl: uploadedImageUrl,
        public_id: response[0].public_id
      };
      onUpload(newImage, imageSrc);

      setIsCropModalVisible(false);
      setCroppedImage(null);
    } catch (error) {
      console.error('Image upload failed', error);
    }
  };

  const handleCropModalCancel = () => {
    setIsCropModalVisible(false);
    setCroppedImage(null);
  };

  return {
    isCropModalVisible,
    imageSrc,
    crop,
    imgRef,
    handleCropClick,
    onImageLoad,
    onCropComplete,
    handleCropModalOk,
    handleCropModalCancel,
    setCrop
  };
};

export default useImageCropper;
