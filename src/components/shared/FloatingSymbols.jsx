import React from 'react';

export function FloatingSymbols() {
  const symbols = [
    { text: "∠ABC", top: "10%", left: "7%", size: "36px" },
    { text: "180°", top: "22%", left: "84%", size: "42px" },
    { text: "360°", top: "74%", left: "10%", size: "38px" },
    { text: "x = 48°", top: "82%", left: "78%", size: "34px" },
    { text: "⊥", top: "42%", left: "93%", size: "32px" },
    { text: "a + b = 180°", top: "16%", left: "46%", size: "28px" },
    { text: "∠1 = ∠3", top: "64%", left: "52%", size: "30px" },
    { text: "90°", top: "88%", left: "36%", size: "36px" }
  ];

  return (
    <div className="floating-bg-container">
      {symbols.map((s, idx) => (
        <span
          key={idx}
          className="floating-bg-item"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            animationDelay: `${idx * 2.2}s`
          }}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}
