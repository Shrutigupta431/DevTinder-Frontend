import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Send,
  Smile,
  Phone,
  Video,
  MoreVertical,
  TruckElectric,
} from "lucide-react";

import { createSocketConnection } from "../../utils/constants/socket";

import { useSelector } from "react-redux";

import type { User } from "../../types/user.types";
import type { RootState } from "../../types/store.types";

import type { Socket } from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../../utils/constants/url";

type MessageType = {
  firstName?: string;
  text: string;
  sender: "me" | "other";
  time: string;
};

type ReceiveMessageType = {
  firstName?: string;
  text: string;
  userId: string;
};

const Chat = () => {
  const { targetUserId } = useParams();

  const location = useLocation();

  const user = location.state?.user;

  const [messages, setMessages] = useState<MessageType[]>([]);

  const [newMessage, setNewMessage] = useState("");

  const [typing, setTyping] = useState(false);

  const loggedInUser = useSelector(
    (store: RootState) => store?.user
  ) as User | null;

  const userId = loggedInUser?._id;

  const firstName = loggedInUser?.firstName;

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const fetchChatMessages =async()=>{
    try{
      const chat = await axios.get(BASE_URL+"/chat/"+ targetUserId,{withCredentials:true});
       console.log("chat",chat?.data.messages);

       const textArray = chat?.data?.messages?.map(msg=>{
        return{
          firstName:msg?.senderId.firstName, lastName:msg?.senderId.lastName, text: msg.text
        }
       })

       setMessages(textArray)
      

    }catch(err){

    }
  }

  useEffect(()=>{
    fetchChatMessages()
  },[])

  // SOCKET CONNECTION
  useEffect(() => {
    if (!userId || !targetUserId) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", {
      firstName,
      userId,
      targetUserId,
    });

    // RECEIVE MESSAGE
    socketRef.current.on(
      "receiveMessage",
      (data: ReceiveMessageType) => {
        setTyping(false);

        setMessages((prev) => [
          ...prev,
          {
            firstName: data.firstName,
            text: data.text,
            sender: data.userId === userId ? "me" : "other",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    );

    // TYPING
    socketRef.current.on("typing", () => {
      setTyping(true);

      setTimeout(() => {
        setTyping(false);
      }, 2000);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, targetUserId, firstName]);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  // SEND MESSAGE
const sendMessage = () => {
  if (!newMessage.trim()) return;

  const msg = {
    firstName,
    userId,
    targetUserId,
    text: newMessage,
  };

  socketRef.current?.emit("sendMessage", msg);

  setNewMessage("");
};

  // TYPING EVENT
  const handleTyping = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewMessage(e.target.value);

    socketRef.current?.emit("typing", {
      firstName,
      targetUserId,
    });
  };
console.log("messages", messages)
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#140152] via-[#22007C] to-[#05010E] flex items-center justify-center p-4 relative">
      
      {/* BACKGROUND BUBBLES */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="w-2xl max-w-5xl h-[82vh] rounded-3xl overflow-hidden border border-white/10 bg-white/10 backdrop-blur-2xl shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          
          <div className="flex items-center gap-4">

            <div className="relative">
              <img
                src={user?.photoUrl}
                alt="profile"
                className="w-14 h-14 rounded-full border-2 border-cyan-400 object-cover"
              />

              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"></span>
            </div>

            <div>
              <h1 className="text-white text-lg font-semibold">
                {user?.firstName} {user?.lastName}
              </h1>

              <p className="text-green-300 text-sm">
                Online
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-5 text-white">
            <Phone className="cursor-pointer hover:text-cyan-400 transition" />

            <Video className="cursor-pointer hover:text-pink-400 transition" />

            <MoreVertical className="cursor-pointer hover:text-yellow-400 transition" />
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 scrollbar-hide">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.firstName !== user.firstName
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-5 py-3 rounded-3xl shadow-lg backdrop-blur-xl text-white relative ${
                  msg.firstName === user.firstName
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 rounded-br-md"
                    : "bg-white/10 border border-white/10 rounded-bl-md"
                }`}
              >
                <p className="text-[15px] break-words">
                  {msg.text}
                </p>

                <span className="text-[10px] text-gray-200 flex justify-end mt-1">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* TYPING INDICATOR */}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white/10 border border-white/10 px-5 py-4 rounded-3xl rounded-bl-md flex gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>

                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></span>

                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT */}
        <div className="p-5 border-t border-white/10 bg-black/20 backdrop-blur-xl">
          
          <div className="flex items-center gap-3">

            <button className="text-yellow-300 hover:scale-110 transition">
              <Smile />
            </button>

            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 bg-white/10 border border-white/10 text-white placeholder-gray-300 px-5 py-4 rounded-2xl outline-none backdrop-blur-xl"
            />

            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-pink-500 to-cyan-500 p-4 rounded-2xl text-white shadow-lg hover:scale-105 transition"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;