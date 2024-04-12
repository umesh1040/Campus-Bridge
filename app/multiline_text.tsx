// YourComponent.tsx

import React from "react";

const MultiLineText: React.FC<{ text: string }> = ({ text }) => {
  // Split the string into an array of lines based on \n
  const lines = text.split("\n");

  return (
    <div>
      {lines.map((line, index) => (
        // Use React.Fragment or div to create a new line
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

export default MultiLineText;
