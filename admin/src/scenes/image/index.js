import React, { useState, useRef } from "react";
import API from "../../services/api";

function ImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);

    // Preview the uploaded image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Convert the uploaded image to a base64-encoded string using Canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const base64String = canvas.toDataURL(file.type).split(",")[1];
      setImageBase64(base64String);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (imageBase64) {
      const response = await API.post({ path: "/video/image", body: c });
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Select Image File:
          <input type="file" onChange={handleImageUpload} />
        </label>

        <br />

        {imagePreview && <img src={imagePreview} alt="Uploaded image preview" width="200" />}

        <br />

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
}

export default ImageUpload;
