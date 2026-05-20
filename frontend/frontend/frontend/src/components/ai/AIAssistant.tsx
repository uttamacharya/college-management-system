"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Bot,
    Send,
    X,
} from "lucide-react";

import {
    aiApi,
} from "@/api/ai.api";

import ReactMarkdown from "react-markdown";

interface Message {

    role:
    "user" |
    "assistant";

    content: string;
}

export function AIAssistant() {

    const [open, setOpen] =
        useState(false);

    const [prompt, setPrompt] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [messages, setMessages] =
        useState<Message[]>([]);

    const bottomRef =
        useRef<HTMLDivElement | null>(
            null
        );

    // AUTO SCROLL

    useEffect(() => {

        bottomRef.current?.scrollIntoView({

            behavior: "smooth",
        });

    }, [messages]);

    // SEND MESSAGE

    const handleAskAI =
        async () => {

            if (!prompt.trim()) {
                return;
            }

            const userMessage = {

                role: "user" as const,

                content: prompt,
            };

            setMessages((prev) => [
                ...prev,
                userMessage,
            ]);

            const currentPrompt =
                prompt;

            setPrompt("");

            try {

                setLoading(true);

                const response =
                    await aiApi.askAI(
                        currentPrompt
                    );

                setMessages((prev) => [

                    ...prev,

                    {
                        role:
                            "assistant",

                        content:
                            response.answer ||
                            "No response",
                    },
                ]);

            } catch (error) {

                setMessages((prev) => [

                    ...prev,

                    {
                        role:
                            "assistant",

                        content:
                            "Something went wrong.",
                    },
                ]);

            } finally {

                setLoading(false);
            }
        };

    return (

        <>

            {/* FLOATING BUTTON */}

            <button
                onClick={() =>
                    setOpen(!open)
                }
                className="
          fixed
          bottom-6
          right-6
          z-50

          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-full

          bg-primary-600

          text-white

          shadow-2xl
          shadow-primary-500/30

          transition-all
          duration-300

          hover:scale-110
        "
            >

                {open ? (

                    <X className="h-6 w-6" />

                ) : (

                    <Bot className="h-6 w-6" />
                )}
            </button>

            {/* CHAT WINDOW */}

            {open && (

                <div
                    className="
            fixed
            bottom-24
            right-6
            z-50

            flex
            h-[600px]
            w-[380px]
            flex-col

            overflow-hidden

            rounded-3xl

            border
            border-white/10

            bg-dark-900/95

            shadow-2xl
            backdrop-blur-xl
          "
                >

                    {/* HEADER */}

                    <div
                        className="
              flex
              items-center
              gap-3

              border-b
              border-white/10

              px-5
              py-4
            "
                    >

                        <div
                            className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-full

                bg-primary-600
              "
                        >

                            <Bot className="h-5 w-5 text-white" />

                        </div>

                        <div>

                            <h2 className="font-semibold text-white">

                                AI Assistant

                            </h2>

                            <p className="text-xs text-dark-400">

                                Ask anything

                            </p>
                        </div>
                    </div>

                    {/* MESSAGES */}

                    <div
                        className="
              flex-1
              space-y-4
              overflow-y-auto
              p-4
            "
                    >

                        {messages.length === 0 && (

                            <div
                                className="
                  mt-20
                  text-center
                  text-dark-400
                "
                            >

                                Ask your first question 🚀

                            </div>
                        )}

                        {messages.map(
                            (msg, index) => (

                                <div
                                    key={index}
                                    className={`
                    max-w-[85%]
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    leading-relaxed

                    ${msg.role === "user"

                                            ? `
                          ml-auto
                          bg-primary-600
                          text-white
                        `

                                            : `
                          bg-dark-800
                          text-dark-100
                        `
                                        }
                  `}
                                >

                                    <ReactMarkdown
                                        components={{

                                            p: ({ children }) => (

                                                <p className="leading-7">
                                                    {children}
                                                </p>
                                            ),

                                            ul: ({ children }) => (

                                                <ul className="list-disc pl-5 space-y-2">
                                                    {children}
                                                </ul>
                                            ),

                                            li: ({ children }) => (

                                                <li className="text-sm">
                                                    {children}
                                                </li>
                                            ),

                                            strong: ({ children }) => (

                                                <strong className="font-semibold text-white">
                                                    {children}
                                                </strong>
                                            ),
                                        }}
                                    >

                                        {msg.content}

                                    </ReactMarkdown>

                                </div>
                            )
                        )}

                        {loading && (

                            <div
                                className="
                  w-fit
                  rounded-2xl
                  bg-dark-800
                  px-4
                  py-3
                  text-dark-300
                "
                            >

                                Thinking...

                            </div>
                        )}

                        <div ref={bottomRef} />

                    </div>

                    {/* INPUT */}

                    <div
                        className="
              border-t
              border-white/10
              p-4
            "
                    >

                        <div className="flex gap-3">

                            <input
                                value={prompt}
                                onChange={(e) =>
                                    setPrompt(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {

                                    if (
                                        e.key === "Enter"
                                    ) {

                                        handleAskAI();
                                    }
                                }}
                                placeholder="Ask AI..."
                                className="
                  flex-1

                  rounded-2xl

                  border
                  border-white/10

                  bg-dark-800

                  px-4
                  py-3

                  text-sm
                  text-white

                  outline-none

                  placeholder:text-dark-400
                "
                            />

                            <button
                                onClick={handleAskAI}
                                disabled={loading}
                                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-2xl

                  bg-primary-600

                  text-white

                  transition-all

                  hover:scale-105

                  disabled:opacity-50
                "
                            >

                                <Send className="h-5 w-5" />

                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}