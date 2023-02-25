import React, { useState } from "react";
import API from "../../services/api";

function Video() {
  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("video", video);

    try {
      const response = await API.postFormData("/video", {}, formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      You are now here
      <form onSubmit={handleFormSubmit}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button type="submit">Extract Frames</button>
      </form>
      <div>
        {images.map((image, index) => (
          <img key={index} src={image} alt={`frame ${index}`} />
        ))}
      </div>
    </div>
  );
}

export default Video;
