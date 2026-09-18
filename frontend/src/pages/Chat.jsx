import { useEffect, useState } from "react";

import {
  Navigate
} from "react-router-dom";

import axios from "axios";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";


const API_URL =
  "http://127.0.0.1:8000";


function cleanMarkdown(text) {
  if (!text) {
    return "";
  }

  return text
    .replace(/\\#/g, "#")
    .replace(/\\\*/g, "*")
    .replace(/\\-/g, "-")
    .replace(/\\_/g, "_");
}


function Chat() {
  const token =
    localStorage.getItem(
      "cropcare_token"
    );


  const [crops, setCrops] =
    useState([]);

  const [selectedCrop, setSelectedCrop] =
    useState("rice");

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {
    const loadCrops = async () => {
      try {
        const response =
          await axios.get(
            `${API_URL}/crops`
          );

        setCrops(
          response.data.crops
        );

      } catch (error) {
        console.error(error);
      }
    };

    loadCrops();

  }, []);


  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  const sendQuestion = async (
    event
  ) => {
    event.preventDefault();


    if (!question.trim()) {
      return;
    }


    const currentQuestion =
      question.trim();


    // Add user's question immediately.
    setMessages(
      (previous) => [
        ...previous,
        {
          type: "user",
          text: currentQuestion
        }
      ]
    );


    // Clear input.
    setQuestion("");


    // Start Thinking state.
    setLoading(true);


    try {
      const response =
        await axios.post(
          `${API_URL}/chat`,
          {
            crop:
              selectedCrop,

            question:
              currentQuestion
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      // Add AI response after Gemini responds.
      setMessages(
        (previous) => [
          ...previous,
          {
            type: "bot",
            text:
              response.data.answer
          }
        ]
      );


    } catch (error) {
      console.error(error);


      let errorMessage =
        "Something went wrong. Please try again.";


      if (
        error.response &&
        error.response.data
      ) {
        if (
          error.response.data.detail
        ) {
          errorMessage =
            error.response.data.detail;
        }
      }


      setMessages(
        (previous) => [
          ...previous,
          {
            type: "bot",
            text:
              `### Notice\n\n${errorMessage}`
          }
        ]
      );


      if (
        error.response &&
        error.response.status === 401
      ) {
        localStorage.removeItem(
          "cropcare_token"
        );

        localStorage.removeItem(
          "cropcare_email"
        );

        window.location.href =
          "/login";
      }


    } finally {
      // Stop Thinking state.
      setLoading(false);
    }
  };


  const clearChat = () => {
    setMessages([]);
  };


  const suggestions = [
    "How often should I irrigate this crop?",
    "What are the common diseases?",
    "How can I manage pests sustainably?",
    "What fertilizer practices should I follow?"
  ];


  return (
    <main className="chat-page">

      <section className="chat-container">

        {/* CHAT HEADER */}

        <div className="chat-header">

          <div>

            <span className="chat-status">
              ● AI Assistant Online
            </span>

            <h2>
              CropCare AI Advisor
            </h2>

            <p>
              Ask questions about your selected crop.
            </p>

          </div>


          <button
            className="clear-button"
            onClick={clearChat}
            disabled={loading}
          >
            Clear Chat
          </button>

        </div>


        {/* CROP SELECTOR */}

        <div className="crop-selector">

          <label>
            Select Crop
          </label>


          <select
            value={selectedCrop}
            onChange={(event) =>
              setSelectedCrop(
                event.target.value
              )
            }
            disabled={loading}
          >

            {crops.map((crop) => (

              <option
                key={crop}
                value={crop.toLowerCase()}
              >
                {crop}
              </option>

            ))}

          </select>

        </div>


        {/* CHAT AREA */}

        <div className="chat-box">

          {messages.length === 0 ? (

            <div className="welcome-message">

              <div className="welcome-icon">
                🌱
              </div>


              <h3>
                How can I help with your crop?
              </h3>


              <p>
                Ask me about irrigation,
                diseases, pests, fertilizers
                or sustainable farming.
              </p>


              <div className="suggestions">

                {suggestions.map(
                  (suggestion) => (

                    <button
                      key={suggestion}
                      onClick={() =>
                        setQuestion(
                          suggestion
                        )
                      }
                      disabled={loading}
                    >
                      {suggestion}
                    </button>

                  )
                )}

              </div>

            </div>

          ) : (

            messages.map(
              (message, index) => (

                <div
                  key={index}
                  className={`message ${
                    message.type === "user"
                      ? "user-message"
                      : "bot-message"
                  }`}
                >

                  <div className="message-avatar">

                    {message.type === "user"
                      ? "👤"
                      : "🌾"}

                  </div>


                  <div className="message-content">

                    {message.type === "bot" ? (

                      <ReactMarkdown
                        remarkPlugins={[
                          remarkGfm
                        ]}
                      >
                        {cleanMarkdown(
                          message.text
                        )}
                      </ReactMarkdown>

                    ) : (

                      <p>
                        {message.text}
                      </p>

                    )}

                  </div>

                </div>

              )
            )

          )}


          {/* AI THINKING STATE */}

          {loading && (

            <div
              className="message bot-message thinking-message"
            >

              <div className="message-avatar">
                🌾
              </div>


              <div className="message-content thinking-content">

                <div className="thinking-text">

                  <span className="thinking-icon">
                    🤖
                  </span>

                  <span>
                    ...Thinking
                  </span>

                  <span className="thinking-dots">

                    <span></span>
                    <span></span>
                    <span></span>

                  </span>

                </div>

              </div>

            </div>

          )}

        </div>


        {/* INPUT */}

        <form
          className="chat-input-area"
          onSubmit={sendQuestion}
        >

          <input
            type="text"
            placeholder={
              `Ask about ${selectedCrop}...`
            }
            value={question}
            onChange={(event) =>
              setQuestion(
                event.target.value
              )
            }
            disabled={loading}
          />


          <button
            type="submit"
            disabled={
              loading ||
              !question.trim()
            }
          >

            {loading
              ? "...Thinking"
              : "Ask →"}

          </button>

        </form>


        {/* DISCLAIMER */}

        <div className="chat-disclaimer">

          🌱 CropCare AI provides general
          agricultural guidance. For serious
          crop damage or unusual symptoms,
          consult a qualified agricultural
          expert or local extension officer.

        </div>

      </section>

    </main>
  );
}


export default Chat;