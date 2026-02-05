'use client';
import { FILE_UPLOAD_MUTATION } from 'graphql/mutations';
import React, {
  ChangeEvent,
  DragEvent,
  SetStateAction,
  useRef,
  useState
} from 'react';
import { BsCloudDownload, BsCloudUpload } from 'react-icons/bs';
import { ProductImage } from 'types/prod';

export interface ImagesProps {
  imageUrl: string;
  public_id: string;
}

interface PROPS {
  setImagesUrl?: React.Dispatch<
    SetStateAction<ImagesProps[] | ProductImage[] | undefined>
  >;
  setposterimageUrl?: React.Dispatch<
    SetStateAction<ImagesProps[] | ProductImage[] | undefined>
  >;
  sethoverImage?: React.Dispatch<
    SetStateAction<ImagesProps[] | ProductImage[] | undefined>
  >;
}

const ImageUploader = ({
  setImagesUrl,
  setposterimageUrl,
  sethoverImage
}: PROPS) => {
  const [isDraggableArea, setIsDraggableArea] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadPhotosToBackend = async (files: File[]) => {
    if (files.length === 0) throw new Error('No files found');

    const Response_data: ImagesProps[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append(
          'operations',
          JSON.stringify({
            query: FILE_UPLOAD_MUTATION,
            variables: { file: null }
          })
        );
        formData.append('map', JSON.stringify({ file: ['variables.file'] }));
        formData.append('file', file);
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL || '', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        const result = await response.json();
        if (result.data) {
          Response_data.push(result.data.createFileUploading);
        }
      }

      return Response_data;
    } catch (error) {
      throw error;
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files) as File[];
    let file;
    if (setposterimageUrl || sethoverImage) {
      file = e.dataTransfer.files[0];
    }
    try {
      const response = await uploadPhotosToBackend(file ? [file] : files);
      setImagesUrl?.((prev = []) => [...prev, ...response]);
      setposterimageUrl?.(response);
      sethoverImage?.(response);
    } catch (error) {
      throw error;
    } finally {
      setIsDraggableArea(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files ? Array.from(e.target.files) : [];
    try {
      const response = await uploadPhotosToBackend(files);
      setImagesUrl?.((prev = []) => [...prev, ...response]);
      setposterimageUrl?.(response);
      sethoverImage?.(response);
    } catch (error) {
      throw error;
    }
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`m-4 cursor-pointer ${isDraggableArea ? 'border border-sky-500' : 'border '}`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggableArea(true);
      }}
      onDragEnter={() => {
        setIsDraggableArea(true);
      }}
      onDragLeave={() => {
        setIsDraggableArea(false);
      }}
      onClick={handleDivClick}
    >
      <div className="p-4 text-center text-black dark:text-white">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
          ref={fileInputRef}
        />
        {isDraggableArea ? (
          <BsCloudDownload className="inline-block mb-2 text-4xl text-gray-500" />
        ) : (
          <BsCloudUpload className="inline-block mb-2 text-4xl text-gray-500" />
        )}
        <p className="text-black dark:text-white">
          Drag & Drop or Click to Upload
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;
