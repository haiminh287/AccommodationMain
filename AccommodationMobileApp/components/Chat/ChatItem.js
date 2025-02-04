import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Styles from '../../styles/Styles';
import { useNavigation } from '@react-navigation/native';

const ChatItem = (prop) => {
    const item = prop.conversation;
    const nav = useNavigation();
    return (
        <TouchableOpacity 
            key={item.id} 
            style={Styles.container} 
            onPress={() => nav.navigate('chatDetails', { 'userReceive':item })}
        >
            <View style={Styles.container}>
                <Image 
                    source={{ uri: `https://res.cloudinary.com/dsz7vteia/${item.avatar}` }} 
                    style={{ width: 50, height: 50, borderRadius: 25 }} 
                />
                <View style={Styles.subject}>
                    <Text>{item.username}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ChatItem;