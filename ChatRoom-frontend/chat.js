"use strict";

/**
 * [connection] is the location of the signalR connection hub that allows 
 * communication with the backend signalR program.
 */
const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5017/chatHub")
  .configureLogging(signalR.LogLevel.Information)
  .build();

/**
 * [start] initiates the linking between the location at [connection] and the
 * html program. This method logs an error to the console if it encounters an 
 * error during execution.
 */
const start = async () => {
  try {
    await connection.start();
    console.log("Connected to ChatRoom backend.");
  } catch (e) {
    console.log(e);
  }
}

/**
 * [joinUser] prompts the user to enter a username for identification throughout
 * the session, and assigns the name to a sessionStorage for easier retrieval.
 */
const joinUser = async () => {
  const name = window.prompt("Enter Username: ");
  if (name) {
    sessionStorage.setItem('user', name);
    await joinChat(name);
  }
}

/**
 * [joinChat(user)] connects the user [user] to the backend to allow communication
 * among active users within the server. Any error encountered during the execution
 * is logged to the console.
 */
const joinChat = async (user) => {
  if (!user) {
    return;
  } try {
    const message = `${user} joined the chat.`;
    await connection.invoke("JoinChat", user, message);
  } catch (e) {
    console.log(e);
  }
}

/**
 * [getUser] returns the name of the particular user entered at the start of the
 * chat session.
 */
const getUser = () => sessionStorage.getItem('user');

/**
 * 
 */
const receiveMessage = async () => {
  const currUser = getUser();
  if (!currUser) {
    return;
  } try {
    await connection.on("ReceiveMessage", (user, message) => {
      const messageType = currUser == user ? "sender" : "reveiver";
      addMessage(message, messageType);
    });
  } catch (e) {
    console.log(e);
  }
}

// Appending to html file
const addMessage = (message, messageType) => {
  const msg = document.getElementById("messageBox");
  const msgElement = document.createElement("div");
  msgElement.classList.add("Message-box");
  msgElement.classList.add(messageType);
  msgElement.innerHTML = message;
  msg.appendChild(msgElement);
}

// Binding send
document.getElementById("Button-send").addEventListener('click', async (e) => {
  e.preventDefault();
  const user = getUser();
  if (!user) {
    return;
  } const txt = document.getElementById("Text-message");
  const msg = txt.value;
  if (msg) {
    await sendMessage(user, `${user}: ${msg}`);
    txt.value = "";
  }
})

const sendMessage = async (user, message) => {
  try {
    await connection.invoke("SendMessage", user, message);
  } catch (e) {
    console.log(e);
  }
}
// Startin stuffee
const startApp = async () => {
  await start(); //Establishing connection
  await joinUser(); // Fetching username and connecting to chat
  await receiveMessage();
}

startApp();