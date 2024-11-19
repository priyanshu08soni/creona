"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Download, Redo, Undo } from "lucide-react";

type TextBox = {
  id: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  textColor: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderlined: boolean;
  fontFamily: string;
};

const EditableCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<number | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [undoStack, setUndoStack] = useState<TextBox[][]>([]);
  const [redoStack, setRedoStack] = useState<TextBox[][]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);


  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      // Draw all text boxes
      textBoxes.forEach(
        ({
          x,
          y,
          text,
          fontSize,
          textColor,
          isBold,
          isItalic,
          isUnderlined,
          fontFamily,
        }) => {
          ctx.font = `${isItalic ? "italic" : ""} ${
            isBold ? "bold" : ""
          } ${fontSize}px ${fontFamily}`;
          ctx.fillStyle = textColor;
          ctx.fillText(text, x, y);

          if (isUnderlined) {
            const textWidth = ctx.measureText(text).width;
            const underlineHeight = 2;
            ctx.fillRect(x, y + underlineHeight, textWidth, underlineHeight);
          }
        }
      );
    }
  }, [textBoxes]);

  const saveStateToUndoStack = () => {
    setUndoStack((prev) => [...prev, [...textBoxes]]);
    setRedoStack([]); // Clear redo stack on new change
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check if mouse is over any text box
      for (const textBox of textBoxes) {
        const ctx = canvas.getContext("2d");
        const textWidth = ctx?.measureText(textBox.text).width || 100;
        const textHeight = textBox.fontSize;

        if (
          mouseX >= textBox.x &&
          mouseX <= textBox.x + textWidth &&
          mouseY >= textBox.y - textHeight &&
          mouseY <= textBox.y
        ) {
          setSelectedTextBoxId(textBox.id);
          setIsDragging(true);
          setOffset({ x: mouseX - textBox.x, y: mouseY - textBox.y });
          return;
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && selectedTextBoxId !== null) {
      const canvas = canvasRef.current;

      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setTextBoxes((prev) =>
          prev.map((textBox) =>
            textBox.id === selectedTextBoxId
              ? { ...textBox, x: mouseX - offset.x, y: mouseY - offset.y }
              : textBox
          )
        );
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) saveStateToUndoStack();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedTextBoxId !== null) {
      saveStateToUndoStack();
      setTextBoxes((prev) =>
        prev.map((textBox) =>
          textBox.id === selectedTextBoxId
            ? { ...textBox, text: e.target.value }
            : textBox
        )
      );
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedTextBoxId !== null) {
      saveStateToUndoStack();
      setTextBoxes((prev) =>
        prev.map((textBox) =>
          textBox.id === selectedTextBoxId
            ? { ...textBox, fontSize: parseInt(e.target.value, 10) }
            : textBox
        )
      );
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedTextBoxId !== null) {
      saveStateToUndoStack();
      setTextBoxes((prev) =>
        prev.map((textBox) =>
          textBox.id === selectedTextBoxId
            ? { ...textBox, textColor: e.target.value }
            : textBox
        )
      );
    }
  };

  const toggleStyle = (
    style: keyof Pick<TextBox, "isBold" | "isItalic" | "isUnderlined">
  ) => {
    if (selectedTextBoxId !== null) {
      saveStateToUndoStack();
      setTextBoxes((prev) =>
        prev.map((textBox) =>
          textBox.id === selectedTextBoxId
            ? { ...textBox, [style]: !textBox[style] }
            : textBox
        )
      );
    }
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedTextBoxId !== null) {
      saveStateToUndoStack();
      setTextBoxes((prev) =>
        prev.map((textBox) =>
          textBox.id === selectedTextBoxId
            ? { ...textBox, fontFamily: e.target.value }
            : textBox
        )
      );
    }
  };

  const handleAddTextBox = () => {
    saveStateToUndoStack();
    const newTextBox: TextBox = {
      id: Date.now(),
      x: 50,
      y: 50,
      text: "New Text",
      fontSize: 20,
      textColor: "#000000",
      isBold: false,
      isItalic: false,
      isUnderlined: false,
      fontFamily: "Arial",
    };
    setTextBoxes((prev) => [...prev, newTextBox]);
    setSelectedTextBoxId(newTextBox.id);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack((prev) => [...prev, [...textBoxes]]);
      setTextBoxes(previousState);
      setUndoStack((prev) => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack((prev) => [...prev, [...textBoxes]]);
      setTextBoxes(nextState);
      setRedoStack((prev) => prev.slice(0, -1));
    }
  };
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "editable_canvas.png";
      link.click();
    }
  };

  return (
    <div className="home-wrapper">
      <div className="button-group">
        <Button
          onClick={handleUndo}
          className="undo-button"
          disabled={undoStack.length === 0}
        >
          <Undo />
        </Button>
        <Button
          onClick={handleRedo}
          className="redo-button"
          disabled={redoStack.length === 0}
        >
          <Redo />
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        width={window?.innerWidth>600?600:400}
        height={400}
        className="canvas"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div>
        <div className="input-text flex gap-8">
          <Button onClick={handleAddTextBox} className="add-text-button">
            Add Text Box
          </Button>
          <div className="flex items-center justify-center bg-blue-200 p-2 rounded-sm">
            <Download onClick={handleDownload} />
          </div>
        </div>
        <div className="input-text">
          <label>
            Font:
            <select
              className="mx-3"
              value={
                textBoxes.find((textBox) => textBox.id === selectedTextBoxId)
                  ?.fontFamily || "Arial"
              }
              onChange={handleFontFamilyChange}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
            </select>
          </label>
        </div>
        <div className="input-text">
          <label>
            Edit Text
            <Input
              ref={inputRef}
              value={
                textBoxes.find((textBox) => textBox.id === selectedTextBoxId)
                  ?.text || ""
              }
              onChange={handleInputChange}
              placeholder="Edit Text"
            />
          </label>
        </div>
        <div className="input-text">
          <label>
            Font Size:
            <Input
              type="number"
              value={
                textBoxes.find((textBox) => textBox.id === selectedTextBoxId)
                  ?.fontSize || 20
              }
              onChange={handleFontSizeChange}
            />
          </label>
        </div>
        <div className="input-text">
          <label>
            Text Color:
            <Input
              type="color"
              value={
                textBoxes.find((textBox) => textBox.id === selectedTextBoxId)
                  ?.textColor || "#000000"
              }
              onChange={handleTextColorChange}
            />
          </label>
        </div>

        <Button className="mx-1 my-2" onClick={() => toggleStyle("isBold")}>
          <b>B</b>
        </Button>
        <Button className="mx-1 my-2" onClick={() => toggleStyle("isItalic")}>
          <i>I</i>
        </Button>
        <Button
          className="mx-1 my-2 "
          onClick={() => toggleStyle("isUnderlined")}
        >
          <u>U</u>
        </Button>
      </div>
    </div>
  );
};

export default EditableCanvas;
