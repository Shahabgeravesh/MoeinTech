"use client";

import React, { useEffect, useRef } from "react";

type SpeedVideoProps = {
  src: string;
  playbackRate?: number;
} & React.VideoHTMLAttributes<HTMLVideoElement>;

export default function SpeedVideo({
  src,
  playbackRate = 1.35,
  ...rest
}: SpeedVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleLoadedMetadata: React.VideoHTMLAttributes<HTMLVideoElement>["onLoadedMetadata"] =
    (event) => {
      if (rest.onLoadedMetadata) {
        rest.onLoadedMetadata(event);
      }
      if (videoRef.current) {
        videoRef.current.playbackRate = playbackRate;
      }
    };

  return (
    <video ref={videoRef} {...rest} onLoadedMetadata={handleLoadedMetadata}>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

\"use client\";

import { useEffect, useRef } from \"react\";

type SpeedVideoProps = {
  src: string;
  playbackRate?: number;
} & React.VideoHTMLAttributes<HTMLVideoElement>;

export default function SpeedVideo({ src, playbackRate = 1.3, ...rest }: SpeedVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleLoadedMetadata: React.VideoHTMLAttributes<HTMLVideoElement>[\"onLoadedMetadata\"] = (event) => {
    if (rest.onLoadedMetadata) {
      rest.onLoadedMetadata(event);
    }
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  };

  return (
    <video
      ref={videoRef}
      {...rest}
      onLoadedMetadata={handleLoadedMetadata}
    >
      <source src={src} type=\"video/mp4\" />
      Your browser does not support the video tag.
    </video>
  );
}

