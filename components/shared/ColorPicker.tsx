"use client";
import React from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void; // Expecting a color string
  label?: string; // Optional label
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value); // Pass only the color value
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {label && <label style={{ fontWeight: "bold" }}>{label}</label>}
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: value,
          border: "2px solid #ccc",
          cursor: "pointer",
        }}
        onClick={() => document.getElementById("colorInput")?.click()}
      ></div>
      <input
        id="colorInput"
        type="color"
        value={value}
        onChange={handleColorChange} // Updated here
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ColorPicker;
