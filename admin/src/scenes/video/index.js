import React, { useState } from "react";
import "./VideoToImages.css";
import API from "../../services/api";
import Transcript from "../../components/transcript";

function VideoToImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeframe, setTimeframe] = useState(10);
  const [audioSrc, setAudioSrc] = useState(null);
  const [imageDescription, setImageDescription] = useState("Video description");

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
    console.log(newImages);
    setLoading(false);
    setProgress(0);

    const response = await API.post({ path: "/video/file", body: newImages });
    console.log(response);

    // audio reader
    // setAudioSrc(response.audioDescription);
    // setImageDescription(response.imageDescription);

    // const audioData = response.data.audio;
    // const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
    // const audioUrl = URL.createObjectURL(audioBlob);

    // const audio = document.createElement("audio");
    // audio.src = audioUrl;
    // document.body.appendChild(audio);

    URL.revokeObjectURL(video.src);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      processVideo(file);
    }
  };

  return (
    <div className="container">
      <div className="form">
        <label>
          Select video file:
          <input type="file" accept="video/*" onChange={handleFileChange} />
        </label>
        <button disabled={loading}>Extract frames</button>
      </div>
      {loading && <div className="progress" style={{ width: `${progress}%` }}></div>}
      <div className="grid">
        {audioSrc && (
          <audio controls>
            <source src={`data:audio/wav;base64,${audioSrc}`} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        )}
        {images.map((imageData, index) => (
          <img key={index} src={imageData} alt={`Frame ${index}`} />
        ))}
      </div>
      <Transcript text={imageDescription} />
    </div>
  );
}

export default VideoToImages;
