import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import { useNavigation } from '@react-navigation/native';
import { MyDispatchContext } from '../../configs/UserContexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshContext } from '../../configs/RefreshContexts';
import { LinearGradient } from 'expo-linear-gradient';

const Article = ({ item, isLike }) => {
    const [isFavorite, setIsFavorite] = useState(isLike);
    const nav = useNavigation();
    const { refresh, setRefresh } = useContext(RefreshContext);
    const [images, setImages] = useState([]);

    const loadImage = async () => {
        const res = await APIs.get(endpoints['images-house'](item.id));
        console.log(res.data);
        setImages(res.data);
    }
    const loadLikeArticles = async () => {
        console.log('item', item);
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
                console.log('dataNoneLogin', res.data);
                ids = res.data.map(item => item.id);
                console.log('dataNoneLogin', ids);
            } catch (e) {
                console.log(e);
            }
        }
        if (ids.includes(item.id)) {
            setIsFavorite(true);
        }
        else {
            setIsFavorite(false);
        }
    }
    useEffect(() => {
        loadLikeArticles();
        loadImage();
    }, [refresh]);
    const toggleFavorite = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log('item', item);
        if (token) {
            const res = await authApis(token).post(endpoints['like-house'](item.id));
            console.log(res.data);
        }
        else {
            const res = await APIs.post(endpoints['like-house'](item.id));
            console.log(res.data);
        }
        setIsFavorite(!isFavorite);
        setRefresh(prev => !prev);
    };


    return (
        <LinearGradient
            colors={['#FDCBFC', '#D9E4FF']} 
            style={styles.articleContainer}
        >
            <TouchableOpacity onPress={() => nav.navigate("articleDetails", { item: item })}>
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
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
                {images.length > 0 && images.map((image, index) => (
                    <View key={index} style={[styles.imageWrapper, { marginLeft: index === 0 ? 0 : -15 }]}>
                        <Image source={{ uri: image.image }} style={styles.imageArt} />
                    </View>
                ))}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    articleContainer: {
        padding: 15,
        marginVertical: 8,
        borderRadius: 20,                      // Bo góc lớn
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    contact: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    location: {
        fontSize: 14,
        color: '#555',
        marginTop: 3,
    },
    imagesContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },
    imageWrapper: {
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 50,
        overflow: 'hidden',
    },
    imageArt: {
        width: 50,
        height: 50,
        borderRadius: 25,                      // Làm ảnh tròn
    },
    checkIcon: {
        position: 'absolute',
        right: 15,
        bottom: 15,
        backgroundColor: '#6A5ACD',           // Màu nền tím nhẹ
        borderRadius: 20,
        padding: 5,
    },
});

export default Article;