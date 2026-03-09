"use client";
import { useState } from "react";
import LoginModal from "./login/page";

export default function Home() {
  const [show, setShow] = useState(false);

  return (
    <div className="bg-gray-900">
      <button onClick={() => setShow(true)}>Login</button>
      {show && <LoginModal onClose={() => setShow(false)} />}
    </div>
  );
}