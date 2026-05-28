import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Send, Smile } from "lucide-react";

import { createSocketConnection } from "../../utils/constants/socket";

import { useSelector } from "react-redux";

import type { User } from "../../types/user.types";
import type { RootState } from "../../types/store.types";

import type { Socket } from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../../utils/constants/url";

type MessageType = {
  messageId?: string;
  firstName?: string;
  text: string;
  sender: "me" | "other";
  time: string;
  deliveredAt?: string | null;
  seenAt?: string | null;
};




const Chat = () => {
  const { targetUserId } = useParams();

  const location = useLocation();

  const user = location.state?.user;

  const [messages, setMessages] = useState<MessageType[]>([]);

  const [newMessage, setNewMessage] = useState("");

  const [typing, setTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const [lastSeen, setLastSeen] = useState("");
  const loggedInUser = useSelector(
    (store: RootState) => store?.user,
  ) as User | null;

  const userId = loggedInUser?._id;

  const firstName = loggedInUser?.firstName;

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const textArray = chat?.data?.messages?.map((msg: any) => {
        return {
          messageId: msg?._id,
          firstName: msg?.senderId?.firstName,
          text: msg?.text,
          sender: msg?.senderId?._id === userId ? "me" : "other",
          time: new Date(msg?.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          deliveredAt: msg?.deliveredAt,
          seenAt: msg?.seenAt,
        };
      });

      setMessages(textArray);

    } catch {
      // ignore
    }
  };
  const fetchUserStatus = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user-status/" + targetUserId);

      setIsOnline(res.data.isOnline);

      if (res.data.lastSeen) {
        setLastSeen(new Date(res.data.lastSeen).toLocaleString());
      }
    } catch {
      // ignore
    }
  };
  useEffect(() => {
    if (!targetUserId) return;

    fetchChatMessages().catch(() => undefined);
    fetchUserStatus().catch(() => undefined);

  }, [targetUserId]);

  // SOCKET CONNECTION
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    // ✅ REGISTER USER
    socket.emit("registerUser", { userId });

    socket.emit("joinChat", {
      firstName,
      userId,
      targetUserId,
    });

    // Ensure correct initial online state even if backend doesn't emit the event
    fetchUserStatus();

    const handleReceiveMessage = (data: any) => {
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          messageId: data.messageId,
          firstName: data.firstName,
          text: data.text,
          sender: data.userId === userId ? "me" : "other",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          deliveredAt: data.deliveredAt ? new Date(data.deliveredAt).toISOString() : null,
          seenAt: data.seenAt ? new Date(data.seenAt).toISOString() : null,
        },

      ]);
      if (data.userId !== userId) {

  socket.emit(
    "messageDelivered",
    {
      userId,
      targetUserId,
      messageId:
        data.messageId,
    }
  );
}
    };


    const handleTyping = () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 2000);
    };

    const handleUserOnline = ({ userId: onlineUserId }: { userId: string }) => {
      if (String(onlineUserId) === String(targetUserId)) {
        setIsOnline(true);
      }
    };

    const handleUserOffline = ({
      userId: offlineUserId,
    }: {
      userId: string;
    }) => {
      if (String(offlineUserId) === String(targetUserId)) {
        setIsOnline(false);
        fetchUserStatus();
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageDelivered", (data: any) => {
      console.log("messageDelivered", data);
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === data.messageId
            ? {
                ...m,
                deliveredAt: data.deliveredAt
                  ? new Date(data.deliveredAt).toISOString()
                  : m.deliveredAt,
              }
            : m,
        ),
      );
    });
    socket.on("messageSeen", (data: any) => {
      console.log("messageSeen", data);
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === data.messageId
            ? {
                ...m,
                seenAt: data.seenAt ? new Date(data.seenAt).toISOString() : m.seenAt,
              }
            : m,
        ),
      );
    });

    socket.on("typing", handleTyping);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);


    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);

      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId, firstName]);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);
  useEffect(() => {

  messages.forEach((msg) => {

    if (
      msg.sender === "other"
      &&
      !msg.seenAt
      &&
      msg.messageId
    ) {

      socketRef.current?.emit(
        "messageSeen",
        {
          userId,
          targetUserId,

          messageId:
            msg.messageId,
        }
      );
    }
  });

}, [messages]);

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

  // TYPING EVENT (input)
  const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    socketRef.current?.emit("typing", {
      firstName,
      userId,
      targetUserId,
    });
  };
  console.log("messages", lastSeen, isOnline);
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

              {/* <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"></span> */}
            </div>

            <div>
              <h1 className="text-white text-lg font-semibold">
                {user?.firstName} {user?.lastName}
              </h1>

              <p className="text-sm">
                {isOnline ? (
                  <span className="text-green-300">🟢 Online</span>
                ) : (
                  <span className="text-gray-300">Last seen {lastSeen}</span>
                )}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          {/* <div className="flex items-center gap-5 text-white">
            <Phone className="cursor-pointer hover:text-cyan-400 transition" />

            <Video className="cursor-pointer hover:text-pink-400 transition" />

            <MoreVertical className="cursor-pointer hover:text-yellow-400 transition" />
          </div> */}
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
                <p className="text-[15px] break-words">{msg.text}</p>

                <div className="flex items-end justify-end gap-2 mt-1">
                  <span className="text-[10px] text-gray-200">{msg.time}</span>
                  {msg.sender === "me" && (
                    <span className="text-[10px] text-gray-200">
                      {msg.seenAt
  ? "✓✓ Seen"
  : msg.deliveredAt
  ? "✓✓ Delivered"
  : "✓ Sent"}
                    </span>
                  )}
                </div>

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
              onChange={handleTypingInput}
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
