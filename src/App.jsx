import React, { useState, useEffect } from "react";
import "./style.css";

function App() {
  const levels = [
    {
      instruction: "Level 1: Center items horizontally",
      answer: "justify-content: center;",
      hint: "Use justify-content for horizontal alignment",
      style: (parsedInput) => ({
        justifyContent: parsedInput["justify-content"] || "flex-start",
      }),
    },
    {
      instruction: "Level 2: Space items evenly",
      answer: "justify-content: space-evenly;",
      hint: "Use justify-content for equal spacing",
      style: (parsedInput) => ({
        justifyContent: parsedInput["justify-content"] || "flex-start",
      }),
    },
    {
      instruction: "Level 3: Stack items vertically",
      answer: "flex-direction: column;",
      hint: "Use flex-direction to change axis",
      style: (parsedInput) => ({
        flexDirection: parsedInput["flex-direction"] || "row",
      }),
    },
    {
      instruction: "Level 4: Center items vertically",
      answer: "align-items: center;",
      hint: "Use align-items for vertical alignment",
      style: (parsedInput) => ({
        alignItems: parsedInput["align-items"] || "stretch",
      }),
    },
    {
      instruction: "Level 5: Reverse row direction",
      answer: "flex-direction: row-reverse;",
      hint: "Use flex-direction with reverse",
      style: (parsedInput) => ({
        flexDirection: parsedInput["flex-direction"] || "row",
      }),
    },
  ];

  const [level, setLevel] = useState(1);
  const [input, setInput] = useState("");
  const [points, setPoints] = useState(0);
  const [hintUsed, setHintUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showHint, setShowHint] = useState(false);

  const currentLevel = levels[level - 1];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          resetToFirstLevel();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const resetToFirstLevel = () => {
    alert("⏰ Time's up! Returning to Level 1.");
    setLevel(1);
    setInput("");
    setShowHint(false);
    setTimeLeft(60);
  };

  const isValidCSS = (text) => {
    const trimmed = text.trim();
    return trimmed.includes(":") && trimmed.endsWith(";");
  };

  const normalizeCSS = (css) =>
    css.trim().replace(/\s+/g, " ").replace(/;$/, "").toLowerCase();

  const parseInput = (input) => {
    try {
      const [property, value] = input.trim().replace(";", "").split(":");
      if (!property || !value) return {};
      return { [property.trim()]: value.trim() };
    } catch {
      return {};
    }
  };

  const checkAnswer = () => {
    const cleanedInput = input.trim();

    if (!isValidCSS(cleanedInput)) {
      alert("⚠️ Incomplete CSS rule. Must include ':' and end with ';'");
      return;
    }

    const normalizedInput = normalizeCSS(cleanedInput);
    const normalizedAnswer = normalizeCSS(currentLevel.answer);

    if (normalizedInput === normalizedAnswer) {
      setPoints((prev) => prev + 5);

      if (level < levels.length) {
        setLevel((prev) => prev + 1);
        setInput("");
        setShowHint(false);
        setTimeLeft(60);
      } else {
        alert("🎉 Congratulations! You've completed all levels! Restarting...");
        setLevel(1);
        setInput("");
        setShowHint(false);
        setTimeLeft(60);
      }
    } else {
      alert("❌ Incorrect CSS. Try again!");
    }
  };

  const retry = () => {
    setInput("");
    setPoints((p) => p - 3);
  };

  const handleHint = () => {
    setShowHint(true);
    setHintUsed((h) => h + 1);
    // No point deduction
  };

  const combinedStyles = {
    display: "flex",
    minHeight: "150px",
    ...currentLevel.style(parseInput(input)),
  };

  return (
    <div className="game-container">
      <h1 className="title">🎮 Flexbox Game Arena</h1>
      <div className="game-info">
        <span>Level: {level}</span>
        <span>Points: {points}</span>
        <span>Time Left: {timeLeft}s</span>
        <span>Hints Used: {hintUsed}</span>
      </div>
      <div className="instruction">{currentLevel.instruction}</div>

      <div className="playground" style={combinedStyles}>
        <div className="box">1</div>
        <div className="box">2</div>
        <div className="box">3</div>
      </div>

      <input
        type="text"
        className="css-input"
        placeholder="Type CSS rule here (e.g., justify-content: center;)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="buttons">
        <button onClick={checkAnswer}>Try</button>
        <button onClick={handleHint}>Show Hint</button>
        <button onClick={retry}>Retry</button>
      </div>
      {showHint && <div className="hint">Hint: {currentLevel.hint}</div>}
    </div>
  );
}

export default App;
