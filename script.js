const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatboxToggler = document.querySelector(".chatbot-toggler");

let userMessage;
const API_KEY = "sk-proj-FpLXtULRV1gfTIuI9w2iT3BlbkFJIuN0EcsI3EG50f8V4j17";

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<span class="material-icons">smart_toy</span><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

const appendAndScroll = (element) => {
  chatbox.appendChild(element);
  chatbox.scrollTop = chatbox.scrollHeight;
};

const generateResponse = (thinkingLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = thinkingLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-0125",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  // Send POST request to API, get response
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      if (data.error && data.error.code === "insufficient_quota") {
        console.error("Quota exceeded:", data.error.message);
        messageElement.textContent =
          "Quota exceeded. Please check your OpenAI account or try again later.";
      } else if (data.choices && data.choices.length > 0) {
        const botMessage = data.choices[0].message.content;
        messageElement.textContent = botMessage;
      } else {
        console.error("Unexpected response format:", data);
        messageElement.textContent = "An error occurred. Please try again.";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      messageElement.textContent = "An error occurred. Please try again.";
    });
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Append the user's message to the chatbox
  appendAndScroll(createChatLi(userMessage, "outgoing"));

  setTimeout(() => {
    // Display "Thinking..." message while waiting for the response
    const thinkingLi = createChatLi("Thinking...", "incoming");
    appendAndScroll(thinkingLi);
    generateResponse(thinkingLi);
  }, 600);
};

sendChatBtn.addEventListener("click", handleChat);
chatboxToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
