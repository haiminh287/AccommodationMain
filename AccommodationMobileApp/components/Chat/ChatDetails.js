import { useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image } from 'react-native';
import moment from 'moment';
import { MyUserContext } from '../../configs/UserContexts';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../../configs/Firebase';
const ChatDetails = () => {
    const route = useRoute();
    const userReceive = route?.params.userReceive;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    let currentUser = useContext(MyUserContext);
    let currentUserId ='';
    if(currentUser){
        currentUserId = currentUser.id;
    }

    const getConversationId = (user1, user2) => {
        return [user1, user2].sort().join('_');
    };
    const conversationId = getConversationId(currentUserId, userReceive.id);
    
    useEffect(() => {
        const loadMessages = () => {
            const q = query(
                collection(db, "conversations", conversationId, "messages"),
                orderBy("createdAt", "asc")
            );
    
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const chats = [];
                querySnapshot.forEach((doc) => {
                    chats.push({ id: doc.id, ...doc.data() });
                });
                setMessages(chats);
            });
    
            return unsubscribe; 
        };
    
        const unsubscribe = loadMessages();
        return () => unsubscribe();
    }, [conversationId]);
    
    const createConversationIfNotExists = async () => {
        const conversationRef = doc(db, "conversations", conversationId);
        const conversationDoc = await getDoc(conversationRef);
    
        if (!conversationDoc.exists()) {
            await setDoc(conversationRef, {
                participants: [currentUserId, userReceive.id],
                createdAt: serverTimestamp()
            });
            console.log("Conversation created successfully");
        }
    };
    
    const saveChat = async (content) => {
        try {
            await createConversationIfNotExists();
            const chatData = {
                userId: currentUserId,
                content: content,
                createdAt: serverTimestamp(),
                username : currentUser.username,
                avatar: currentUser.avatar,
            };
            await addDoc(collection(db, "conversations", conversationId, "messages"), chatData);
            console.log("Chat saved successfully");
        } catch (error) {
            console.error("Error saving chat: ", error);
        }
    };
    
    const sendMessage = () => {
        if (inputMessage.trim()) {
            saveChat(inputMessage);
            setInputMessage('');
        }
    };
    
    const renderItem = ({ item }) => (
        <View style={[styles.messageContainer, item.userId === currentUserId ? styles.currentUserMessage : styles.otherUserMessage]}>
            <Image source={{ uri: item.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
            <Text>{item.username}</Text>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text>{moment(item.createdAt?.toDate()).fromNow()}</Text>
        </View>
    );
    
    return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center', padding: 10 }}>Chat {userReceive.id}</Text>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tin nhắn"
                    value={inputMessage}
                    onChangeText={setInputMessage}
                />
                <Button title="Gửi" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    messageList: {
        flex: 1,
    },
    messageContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderRadius: 5,
        marginVertical: 5,
        maxWidth: '80%',
    },
    currentUserMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    otherUserMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF',
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
});

export default ChatDetails;