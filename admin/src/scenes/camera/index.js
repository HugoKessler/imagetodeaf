import React, { useRef, useState, useEffect } from "react";
import API from "../../services/api";

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const galleryRef = useRef(null);
  const intervalTime = 5000;
  const [imgSrc, setImgSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      takeScreenshot();
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  async function takeScreenshot() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const gallery = galleryRef.current;

    if (!video || !canvas || !gallery) {
      return;
    }

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const img = new Image();

    //todo: need to send image to backend

    c = canvas.toDataURL("image/png");

    const response = await API.post({ path: "/video/live", body: c });

    // audio reader
    setAudioSrc(response.audioDescription);
  }

  return (
    <div>
      <video ref={videoRef} width="320" height="240" autoPlay></video>
      <canvas ref={canvasRef} width="320" height="240" style={{ display: "none" }}></canvas>
      <div></div>
      {audioSrc && (
        <audio controls>
          <source src={`data:audio/wav;base64,${audioSrc}`} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default Camera;
