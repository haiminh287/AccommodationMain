import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import { useNavigation } from '@react-navigation/native';
import { MyDispatchContext } from '../../configs/UserContexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshContext } from '../../configs/RefreshContexts';

const Article = ({ item ,isLike}) => {
    const [isFavorite, setIsFavorite] = useState(isLike);
    const nav = useNavigation();
    const {refresh,setRefresh } = useContext(RefreshContext);

    const loadLikeArticles = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        let ids = [];
        if (token) {
            const res = await authApis(token).get(endpoints['user-like-house']);
            ids = res.data.map(item => item.acquisition.id);
            console.log('data', ids);
            
        } else {
            try {
                const res = await APIs.get(endpoints['user-like-house']);
                console.log('dataNoneLogin',res.data);
                ids = res.data.map(item => item.id);
                console.log('dataNoneLogin', ids);
            } catch (e) {
                console.log(e);
            }
        }
        if (ids.includes(item.id)) {
            setIsFavorite(true);
        }
        else{
            setIsFavorite(false);
        }
    }
    useEffect(()=>{
        loadLikeArticles();
        
    }, [refresh]);
    const toggleFavorite = async () => {
        const token =  await AsyncStorage.getItem('token');
        if (token){
            const res = await authApis(token).post(endpoints['like-house'](item.id));
            console.log(res.data);
        }
        else{
            const res = await APIs.post(endpoints['like-house'](item.id));
            console.log(res.data);
        }
        setIsFavorite(!isFavorite);
        setRefresh(prev => !prev);
    };


    return (
        <View style={styles.articleContainer}>
            <TouchableOpacity onPress={()=>{nav.navigate("articleDetails", { item: item })}}>
                <View style={styles.header}>
                    <Text style={styles.title}>{item.title}</Text>
                    <TouchableOpacity onPress={toggleFavorite}>
                        <FontAwesome
                            name={isFavorite ? 'heart' : 'heart-o'}
                            size={24}
                            color="red"
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.contact}>Contact: {item.contact}</Text>
                <Text style={styles.location}>Location: {item.location}</Text>
                <View style={styles.imagesContainer}>
                {Array.isArray(item.images) && item.images.length > 0 ? (
                    item.images.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image.image }}
                            style={styles.image}
                        />
                    ))
                ): null}
            </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    articleContainer: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        fontSize: 14,
        marginTop: 5,
    },
    contact: {
        fontSize: 14,
        marginTop: 5,
    },
    location: {
        fontSize: 14,
        marginTop: 5,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
});

export default Article;