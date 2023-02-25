import React, { useState } from "react";
import API from "../../services/api";

function Video() {
  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    setVideo(event.target.files);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // const formData = new FormData();
    // formData.append("video", video);
    try {
      console.log("video", video);

      const response = await API.uploadFile(`/video`, video);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      You are now here
      <form onSubmit={handleFormSubmit}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <input type="file" className="hidden" accept="image/*, .pdf, .xls, .xlsx" onChange={(e) => handleFileChange(e)} />

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
