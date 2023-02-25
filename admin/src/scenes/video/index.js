import React, { useState } from "react";
import "./VideoToImages.css";

function VideoToImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeframe, setTimeframe] = useState(1);

  const processVideo = async (file) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);

    await new Promise((resolve) => {
      video.addEventListener("loadedmetadata", resolve);
    });

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");

    const duration = video.duration;
    const interval = timeframe; // Extract image every selected timeframe
    const frames = Math.ceil(duration / interval);

    setLoading(true);

    const newImages = [];
    for (let i = 0; i < frames; i++) {
      const currentTime = i * interval;
      video.currentTime = currentTime;
      await new Promise((resolve) => {
        video.addEventListener(
          "seeked",
          () => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL("image/png");
            newImages.push(imageData);
            const newProgress = Math.round(((i + 1) / frames) * 100);
            setProgress(newProgress);
            resolve();
          },
          { once: true }
        );
      });
    }

    setImages(newImages);
    setLoading(false);
    setProgress(0);

    URL.revokeObjectURL(video.src);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      processVideo(file);
    }
  };

  const handleTimeframeChange = (event) => {
    const newTimeframe = parseFloat(event.target.value);
    setTimeframe(newTimeframe);
  };

  return (
    <div className="container">
      <div className="form">
        <label>
          Select video file:
          <input type="file" accept="video/*" onChange={handleFileChange} />
        </label>
        <label>
          Select timeframe (in seconds):
          <select value={timeframe} onChange={handleTimeframeChange}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </label>
        <button disabled={loading}>Extract frames</button>
      </div>
      {loading && <div className="progress" style={{ width: `${progress}%` }}></div>}
      <div className="grid">
        {images.map((imageData, index) => (
          <img key={index} src={imageData} alt={`Frame ${index}`} />
        ))}
      </div>
    </div>
  );
}

export default VideoToImages;
