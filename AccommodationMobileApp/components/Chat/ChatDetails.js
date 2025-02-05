import { useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import moment from 'moment';
import { MyUserContext } from '../../configs/UserContexts';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../../configs/Firebase';
import { Ionicons } from '@expo/vector-icons';

const ChatDetails = () => {
    const route = useRoute();
    const userReceive = route?.params?.userReceive;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const currentUser = useContext(MyUserContext);
    const currentUserId = currentUser?.id || '';
    
    const flatListRef = useRef(null);  // Ref để cuộn xuống cuối

    // Hàm lấy conversationId
    const getConversationId = (user1, user2) => [user1, user2].sort().join('_');
    const conversationId = getConversationId(currentUserId, userReceive.id);

    useEffect(() => {
        const q = query(
            collection(db, "conversations", conversationId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(chats);
            
            // Cuộn xuống cuối khi tin nhắn mới được thêm vào
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 300);
        });

        return () => unsubscribe();
    }, [conversationId]);

    // Hàm tạo cuộc trò chuyện nếu chưa tồn tại
    const createConversationIfNotExists = async () => {
        const conversationRef = doc(db, "conversations", conversationId);
        const conversationDoc = await getDoc(conversationRef);

        if (!conversationDoc.exists()) {
            await setDoc(conversationRef, {
                participants: [currentUserId, userReceive.id],
                createdAt: serverTimestamp()
            });
        }
    };

    // Hàm gửi tin nhắn
    const saveChat = async (content) => {
        if (!content.trim()) return;

        try {
            await createConversationIfNotExists();
            await addDoc(collection(db, "conversations", conversationId, "messages"), {
                userId: currentUserId,
                content,
                createdAt: serverTimestamp(),
                username: currentUser.username,
                avatar: currentUser.avatar,
            });
            setInputMessage('');
        } catch (error) {
            console.error("Error saving chat: ", error);
        }
    };

    // Render tin nhắn
    const renderItem = ({ item }) => {
        const isCurrentUser = item.userId === currentUserId;
        return (
            <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
                {!isCurrentUser && <Image source={{ uri: item.avatar }} style={styles.avatar} />}
                <View style={styles.messageBubble}>
                    <Text style={styles.messageText}>{item.content}</Text>
                    <Text style={styles.timeText}>
                        {item.createdAt ? moment(item.createdAt.toDate()).fromNow() : "Đang gửi..."}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={{ uri: userReceive.avatar }} style={styles.headerAvatar} />
                <Text style={styles.headerTitle}>{userReceive.username}</Text>
            </View>

            <FlatList
                ref={flatListRef}  
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tin nhắn..."
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    onSubmitEditing={() => saveChat(inputMessage)}
                />
                <TouchableOpacity onPress={() => saveChat(inputMessage)} style={styles.sendButton}>
                    <Ionicons name="send" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

// 🔹 Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        elevation: 2,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    messageList: {
        flex: 1,
        paddingHorizontal: 10,
    },
    messageContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    messageBubble: {
        maxWidth: "75%",
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    currentUserMessage: {
        alignSelf: "flex-end",
        flexDirection: "row-reverse",
        borderRadius: 15,
        padding: 10,
    },
    otherUserMessage: {
        alignSelf: "flex-start",
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        marginRight: 8,
    },
    messageText: {
        fontSize: 16,
        color: "#000",
    },
    timeText: {
        fontSize: 12,
        color: "#777",
        alignSelf: "flex-end",
        marginTop: 2,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        fontSize: 16,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 20,
    },
});

export default ChatDetails;
