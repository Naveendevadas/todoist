"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isSignup
      ? "http://localhost:5000/api/users/signup"
      : "http://localhost:5000/api/users/login";

    const body = isSignup
      ? { name, email, password }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",   // ⭐ VERY IMPORTANT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        alert(isSignup ? "Account Created!" : "Login Successful!");

        onClose();                // close modal
        router.push("/todolist"); // ⭐ redirect to todo page
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-transparent flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-300 w-[380px] p-8 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {isSignup ? "Create Account" : "Login"}
          </h2>
          <button
            onClick={onClose}
            className="text-lg hover:text-red-500 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
            />
          )}

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
          />

          <button
            type="submit"
            className="bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="ml-1 text-black font-medium cursor-pointer hover:underline"
          >
            {isSignup ? "Login" : "Create Account"}
          </span>
        </p>
      </div>
    </div>
  );
}