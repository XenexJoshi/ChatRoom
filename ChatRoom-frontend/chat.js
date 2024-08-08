"use strict";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5017/chatHub")
  .configureLogging(signalR.LogLevel.Information)
  .build();

// Initializing connection to SignalR backend
const start = async () => {
  try {
    await connection.start();
    console.log("connected");
  } catch (e) {
    console.log(e);
  }
}

// Setting username to storage
const joinUser = async () => {
  const name = window.prompt("Enter Username: ");
  if (name) {
    sessionStorage.setItem('user', name);
    await joinChat(name);
  }
}

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
//Fetching user name
const getUser = () => sessionStorage.getItem('user');

// Getting notification from server
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
// Startin stuff
const startApp = async () => {
  await start(); //Establishing connection
  await joinUser(); // Fetching username and connecting to chat
  await receiveMessage();
}

startApp();