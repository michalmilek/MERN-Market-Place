import React, { useState } from "react";
import { Upload, Button, UploadFile, message } from "antd";
import { useDispatch } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { UploadProductImg } from "../apicalls/products";

const Images = ({ selectedProduct, getData, setShowProductsForm }: any) => {
  const [showPreview, setShowPreview] = useState(true);
  const [images, setImages] = useState(selectedProduct.images);
  const [file, setFile] = useState<UploadFile<any> | null>(null);
  const dispatch = useDispatch();

  const uploadFile = async () => {
    try {
      dispatch(SetLoader(true));
      const formData = new FormData();
      if (file) {
        formData.append("file", file as any);
        formData.append("productId", selectedProduct._id);
        const response = await UploadProductImg(formData);
        dispatch(SetLoader(false));
        if (response.success) {
          message.success(response.message);
          setImages([...images, response.result.url]);
          setShowPreview(false);
          setFile(null);
          getData();
        }
      } else {
        throw new Error("There is no file to upload");
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error((error as Error).message);
    }
  };

  return (
    <div>
      <div className="flex gap-5 mb-5">
        {images.map((image: any) => (
          <div className="flex gap-2 border-solid border-gray-500 rounded">
            <img
              className="h-20 w-20 object-cover"
              src={image}
              alt=""
            />
          </div>
        ))}
      </div>
      <Upload
        listType="picture-card"
        beforeUpload={() => false}
        onChange={(info) => {
          setFile(info.file);
          setShowPreview(true);
        }}
        showUploadList={showPreview}>
        <Button type="dashed">Upload image</Button>
      </Upload>

      <div className="flex justify-end gap-5 mt-5">
        <Button
          onClick={() => {
            setShowProductsForm(false);
          }}>
          Cancel
        </Button>
        <Button
          disabled={!file}
          type="primary"
          onClick={() => uploadFile()}>
          Upload
        </Button>
      </div>
    </div>
  );
};

export default Images;
