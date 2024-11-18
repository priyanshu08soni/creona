import React from "react";

interface FontSizeInputProps {
  value: number;
  onChange: (size: number) => void;
  label?: string;
  min?: number;
  max?: number;
}

const FontSizeInput: React.FC<FontSizeInputProps> = ({
  value,
  onChange,
  label,
  min = 10,
  max = 50,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {label && <label style={{ fontWeight: "bold" }}>{label}</label>}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1 }}
      />
      <span style={{ fontWeight: "bold" }}>{value}px</span>
    </div>
  );
};

export default FontSizeInput;
