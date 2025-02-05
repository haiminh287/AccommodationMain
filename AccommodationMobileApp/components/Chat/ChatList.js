import { View, Text, FlatList } from 'react-native';
import React, { useState } from 'react';
import ChatItem from './ChatItem';
import { db } from "../../configs/Firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

const ChatList = ({ usersChatWithMe }) => {
  const [loading, setLoading] = useState(false);

  const getLastMessage = async (conversationId) => {
    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const lastMsg = snapshot.docs[0].data();
      console.log("Last message:", lastMsg);
      return { content: lastMsg.content, createdAt: lastMsg.createdAt };
    }
    return null;
  };

  return (
    <FlatList
      data={usersChatWithMe}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <ChatItem key={item.id} userReceive={item} getLastMessage={getLastMessage} />
      )}
    />
  );
};

export default ChatList;
