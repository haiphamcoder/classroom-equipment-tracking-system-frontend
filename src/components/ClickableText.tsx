import React from "react";

interface ClickableTextProps {
  text: string;
  onClick: () => void;
  style?: React.CSSProperties;
}

const ClickableText: React.FC<ClickableTextProps> = ({ text, onClick, style }) => {
  return (
    <span
      onClick={onClick}
      style={{
        cursor: "pointer",
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLSpanElement).style.textDecoration = "underline";
        (e.target as HTMLSpanElement).style.backgroundColor = "transparent";
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLSpanElement).style.textDecoration = "none";
        (e.target as HTMLSpanElement).style.backgroundColor = "transparent";
      }}
    >
      {text}
    </span>
  );
};

export default ClickableText;

