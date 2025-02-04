import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import ChatItem from './ChatItem';

const ChatList = ({ usersChatWithMe }) => {
  const [loading, setLoading] = useState(false);
  // console.error("Conversations", conversations);

  return (
    <FlatList
      // refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      // onEndReached={loadMore}
      data={usersChatWithMe}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <ChatItem key={item.id} conversation={item} />
      )}
    />
  );
};

export default ChatList;