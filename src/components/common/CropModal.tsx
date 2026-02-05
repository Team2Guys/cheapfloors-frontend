'use client';
import React from 'react';
import ReactCrop from 'react-image-crop';
import Image from 'next/image';
import 'react-image-crop/dist/ReactCrop.css';
import { CropModalProps } from 'types/product-crop';
import Modal from 'components/ui/modal';

const CropModal = ({
  visible,
  imageSrc,
  crop,
  setCrop,
  onCropComplete,
  imgRef,
  onImageLoad,
  onOk,
  onCancel
}: CropModalProps) => {
  return (
    <Modal isOpen={visible} onClose={onCancel} onOk={onOk} onCancel={onCancel}>
      {imageSrc && (
        <ReactCrop
          className="mt-5"
          crop={crop}
          onChange={setCrop}
          onComplete={onCropComplete}
        >
          <Image
            src={imageSrc}
            alt="Crop"
            ref={imgRef}
            width={500}
            height={300}
            onLoad={onImageLoad}
            crossOrigin="anonymous"
          />
        </ReactCrop>
      )}
    </Modal>
  );
};

export default CropModal;
