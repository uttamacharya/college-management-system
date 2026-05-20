"use client";

import {
  useState,
} from "react";

import {
  aiApi,
} from "@/api/ai.api";

export default function TestAIPage() {

  const [loading, setLoading] =
    useState(false);

  const [response, setResponse] =
    useState("");

  const handleAskAI =
    async () => {

      try {

        setLoading(true);

        const data =
          await aiApi.askAI(
            "Hello AI"
          );

        console.log(
          "AI RESPONSE =>",
          data
        );

        setResponse(
          JSON.stringify(
            data,
            null,
            2
          )
        );

      } catch (error) {

        console.log(
          "AI ERROR =>",
          error
        );
      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="p-10 space-y-6">

      <button
        onClick={handleAskAI}
        className="
          rounded-xl
          bg-primary-600
          px-6
          py-3
          text-white
        "
      >

        {loading
          ? "Loading..."
          : "Test AI"}

      </button>

      <pre className="text-white">

        {response}

      </pre>
    </div>
  );
}