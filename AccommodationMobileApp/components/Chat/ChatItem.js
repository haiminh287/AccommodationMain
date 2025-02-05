import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Styles from '../../styles/Styles';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { MyUserContext } from '../../configs/UserContexts';

const ChatItem = ({  userReceive, getLastMessage }) => {
    const [lastMessage, setLastMessage] = useState(null);
    const nav = useNavigation();
    let currentUser = useContext(MyUserContext);
    let currentUserId ='';
    if(currentUser){
        currentUserId = currentUser.id;
    }
    console.log();
    const getConversationId = (user1, user2) => {
        return [user1, user2].sort().join('_');
    };
    const conversationId = getConversationId(currentUserId, userReceive.id);
    const fetchLastMessage = async () => {
        const msg = await getLastMessage(conversationId);
        setLastMessage(msg);
    };
    console.log(lastMessage);

    useEffect(() => {
        fetchLastMessage();
    }, [conversationId]);

    
    return (
        <TouchableOpacity 
            key={userReceive.id} 
            style={Styles.container} 
            onPress={() => nav.navigate('chatDetails', { 'userReceive': userReceive })}
        >
            <View style={Styles.container}>
                <Image 
                    source={{ uri: userReceive.avatar }} 
                    style={{ width: 50, height: 50, borderRadius: 25 }} 
                />
                <View style={Styles.subject}>
                    <Text>{userReceive.username}</Text>
                    {lastMessage && (
                        <Text numberOfLines={1} style={{ color: 'gray' }}>
                            {lastMessage.content} • {moment(lastMessage.createdAt?.toDate()).fromNow()}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ChatItem;
