"use client";

import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#FFF8F0",
          color: "#2D2D2D",
          borderRadius: "16px",
        },
      }}
    />
  );
}
