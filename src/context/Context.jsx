import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };
  function formatResponse(response) {
    if (!response) return ""; // Handle empty or null response

    let formattedResponse = "";
    let isBold = false;
    let buffer = "";

    // Split response into lines to handle headers and format separately
    const lines = response.split("\n");

    lines.forEach((line) => {
      // Trim whitespace from the line
      line = line.trim();

      // Check for header (Markdown style)
      if (line.startsWith("## ")) {
        // Convert Markdown header to HTML <h2>
        formattedResponse += `<h2>${line.substring(3).trim()}</h2>`;
      } else if (line.startsWith("# ")) {
        // Convert Markdown header to HTML <h1>
        formattedResponse += `<h1>${line.substring(2).trim()}</h1>`;
      } else if (line.startsWith("- ")) {
        // Convert list item to HTML <li>
        formattedResponse += `<li>${line.substring(2).trim()}</li>`;
      } else if (line.length > 0) {
        // Only process non-empty lines
        // Process character by character for bold and line breaks
        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          // Check for bold marker '**'
          if (char === "*" && line[i + 1] === "*") {
            if (isBold) {
              // Close bold tag
              formattedResponse += `<b>${buffer.trim()}</b>`;
              buffer = ""; // Reset buffer after adding bold text
            } else {
              // Add any pending text before bold starts
              if (buffer) {
                formattedResponse += buffer.trim() + " "; // Add space before bold starts
              }
              buffer = ""; // Reset buffer before bold text starts
            }
            isBold = !isBold; // Toggle bold state
            i++; // Skip next '*', since we already processed '**'
          } else if (char === "*") {
            // Handle single '*' as a line break (optional - can be removed if not desired)
            if (buffer) {
              formattedResponse += buffer.trim() + "<br>";
              buffer = ""; // Reset buffer after line break
            }
          } else {
            // Preserve characters and add current character to the buffer
            buffer += char;
          }
        }

        // Add any remaining text after parsing the line without additional line breaks
        if (buffer) {
          formattedResponse += buffer.trim() + "<br>"; // Ensure a line break after each processed line
          buffer = ""; // Reset buffer for the next line
        }
      }
    });

    // Wrap unordered list items in <ul> if there are any
    if (formattedResponse.includes("<li>")) {
      formattedResponse = `<ul>${formattedResponse}</ul>`;
    }

    return formattedResponse.replace(/<br>\s*<br>/g, "<br>"); // Remove extra line breaks
  }

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);

      response = await run(input);
    }

    // format the response
    const resData = formatResponse(response);
    //setResultData(resData);
    let newResponseArray = resData.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };
  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    input,
    setInput,
    loading,
    setLoading,
    resultData,
    onSent,
    recentPrompt,
    setRecentPrompt,
    setShowResult,
    showResult,
    setResultData,
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
