import React from "react";

const YouTubeEmbed: React.FC<{ embedId: string }> = ({ embedId }) => (
  <div className="video-responsive">
    <iframe
      width="100%"
      height="600"
      src={embedId}
      className="rounded-xl"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
      allowFullScreen
    ></iframe>
  </div>
);

export default YouTubeEmbed;
