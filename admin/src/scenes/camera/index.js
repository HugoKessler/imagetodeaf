import React, { useRef, useState, useEffect } from "react";
import API from "../../services/api";
import Transcript from "../../components/transcript";

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const galleryRef = useRef(null);
  const intervalTime = 5000;
  const [imgSrc, setImgSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [imageDescription, setImageDescription] = useState("Image Description");

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
    console.log("here");
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const gallery = galleryRef.current;

    if (!video || !canvas || !gallery) {
      console.log("no video or canvas or gallery");
      return;
    }

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const img = new Image();

    //todo: need to send image to backend

    c = canvas.toDataURL("image/png");

    const response = await API.post({ path: "/video/live", body: c });
    console.log(response);

    // audio reader
    // setAudioSrc(response.audioDescription);
    // setImageDescription(response.imageDescription);
  }

  return (
    <div>
      <video ref={videoRef} width="100%" autoPlay onClick={takeScreenshot}></video>
      <div></div>
      {audioSrc && (
        <audio controls>
          <source src={`data:audio/wav;base64,${audioSrc}`} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
      <Transcript text={imageDescription} />
    </div>
  );
}

export default Camera;
