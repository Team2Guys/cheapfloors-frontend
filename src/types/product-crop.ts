import { Crop } from 'react-image-crop';

export interface CropModalProps {
  visible: boolean;
  imageSrc: string | null;
  crop: Crop;
  setCrop: (_crop: Crop) => void;
  onCropComplete: (_crop: Crop) => void;
  imgRef: React.RefObject<HTMLImageElement | null>;
  onImageLoad: (_e: React.SyntheticEvent<HTMLImageElement>) => void;
  onOk: () => void;
  onCancel: () => void;
}
