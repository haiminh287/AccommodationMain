import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { MyUserContext } from '../../configs/UserContexts';

const ChatItem = ({ userReceive, getLastMessage }) => {
    const [lastMessage, setLastMessage] = useState(null);
    const navigation = useNavigation();
    const currentUser = useContext(MyUserContext);
    const currentUserId = currentUser?.id || '';

    const getConversationId = (user1, user2) => [user1, user2].sort().join('_');
    const conversationId = getConversationId(currentUserId, userReceive.id);

    const fetchLastMessage = async () => {
        const msg = await getLastMessage(conversationId);
        setLastMessage(msg);
    };

    useEffect(() => {
        fetchLastMessage();
    }, [conversationId]);

    return (
        <TouchableOpacity
            key={userReceive.id}
            style={styles.container}
            onPress={() => navigation.navigate('chatDetails', { userReceive })}
        >
            <View style={styles.chatItem}>
                <View>
                    <Image 
                        source={{ uri: userReceive.avatar }} 
                        style={styles.avatar} 
                    />
                    {userReceive.isOnline && <View style={styles.onlineIndicator} />}
                </View>

                <View style={styles.chatInfo}>
                    <Text style={styles.username}>{userReceive.username}</Text>
                    {lastMessage && (
                        <Text numberOfLines={1} style={styles.lastMessage}>
                            {lastMessage.senderId === currentUserId ? "You: " : ""}
                            {lastMessage.content} • {moment(lastMessage.createdAt?.toDate()).fromNow()}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    onlineIndicator: {
        width: 12,
        height: 12,
        backgroundColor: "green",
        borderRadius: 6,
        position: "absolute",
        bottom: 2,
        right: 2,
        borderWidth: 2,
        borderColor: "#fff",
    },
    chatInfo: {
        flex: 1,
        marginLeft: 12,
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
    },
    lastMessage: {
        fontSize: 14,
        color: "gray",
    },
});

export default ChatItem;
