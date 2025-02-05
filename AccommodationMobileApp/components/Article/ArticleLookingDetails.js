import { Button, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/UserContexts";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import moment from "moment";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ArticleLookingDetails = ({route})=>{
    const item = route.params?.item;
    const isMe = route.params?.isMe;
    const nav = useNavigation();
    const [showFullContent, setShowFullContent] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [follow, setFollow] = useState(false);
    const user = useContext(MyUserContext);
    const formattedDeposit = new Intl.NumberFormat('vi-VN').format(item.deposit);

    const loadFollow = async () => {
        if(user){
            const token = await AsyncStorage.getItem('token');
            console.log('token',token);
            const res = await authApis(token).get(endpoints['follow-user']);
            console.log('data',res.data);
            const isFollowing = res.data.some(follow => follow.followed_user === item.user.id);
            setFollow(isFollowing);
        }
    }
    const handleCall = () => {
        const phoneNumber = `tel:${item.user.phone}`;
        Linking.canOpenURL(phoneNumber)
            .then((supported) => {
                if (!supported) {
                    Alert.alert('Lỗi', 'Thiết bị không hỗ trợ gọi điện');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch((err) => console.error('Lỗi mở URL:', err));
    };
    const loadComment = async () => {
        const res = await APIs.get(endpoints['comment-article'](item.id));
        setComments(res.data);
        console.log('data',res.data);
    }
    const sendComment = async (content) =>{
        const token = await AsyncStorage.getItem('token');
        const res = await authApis(token).post(endpoints['comment-article'](item.id),{
            "content": content
        });
        console.log('data',res.data);
        setComments([...comments, res.data]); 
        setContent('');
    }
    const handleChatPress = () => {
        if (user) {
            nav.navigate('chatDetails', { userReceive: item.user });
        } else {
            nav.navigate('login', {
                redirect: 'chatDetails',
                params: { userReceive: item.user },
            });
        }
    };
    
    const followUser = async ()=>{
        if(!user){
            nav.navigate('login', {
                redirect: 'articleDetails',
                params: { item: item },
            });
        }
        else{
            const token = await AsyncStorage.getItem('token');
            console.log('token',token);
            const res = await authApis(token).post(endpoints['follow-user'],{
                "follow_user_id": item.user.id
            });
            setFollow(!follow);
            console.log('data',res.data);
        }
    }
    useEffect(()=>{
        loadComment(content);
        loadFollow();
    },[]);
    const toggleContent = () => {
        console.log('toggle');
        setShowFullContent(!showFullContent);
    };

    const toggleMap = () => {
        setShowMap(!showMap);
    };
    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
            {item.title && <Text style={styles.title}>{item.title}</Text>}
            {item.location && <Text style={styles.location}>Địa Chỉ: {item.location}</Text>}
            {item.created_at && (
            <Text style={styles.createdAt}>
                Thời Gian Đăng: {moment(item.created_at).format('hh:mm:ss, DD/MM/YYYY')}
            </Text>
            )}
            {item.deposit && <Text style={styles.deposit}>Giá: {formattedDeposit} đ/tháng</Text>}
            {item.number_people && <Text style={styles.numberPeople}>Số Người Ở: {item.number_people}</Text>}
            {item.content && (
            <Text style={styles.content}>
                Mô Tả Chi Tiết: {showFullContent ? item.content : `${item.content.substring(0, 100)}...`}
            </Text>
            )}
            {item.content && item.content.length > 100 && (
            <TouchableOpacity onPress={toggleContent}>
                <Text style={styles.seeMore}>{showFullContent ? 'Thu gọn' : 'Xem chi tiết'}</Text>
            </TouchableOpacity>
            )}
                {showMap && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude:parseFloat(item.latitude) ,
                        longitude: parseFloat(item.longitude),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                        }}
                        title={item.title}
                        description={item.location}
                    />
                </MapView>
            )}
            <TouchableOpacity onPress={toggleMap}>
                <Text style={styles.seeMore}>{showMap ? 'Ẩn bản đồ' : 'Xem bản đồ'}</Text>
            </TouchableOpacity>
            <View style={styles.commentContainer}>
                    {comments && comments.map(c => (
                        <List.Item
                            key={c.id}
                            title={c.content}
                            description={moment(c.created_date).fromNow()}
                            left={() => (
                                <Image
                                    source={{ uri: c.user.avatar }}
                                    style={styles.avatar}
                                />
                            )}
                            style={styles.commentItem}
                        />
                    ))}
                </View>
                {!isMe && <><View>
                <TextInput placeholder='Nhập Bình Luận' value={content}
                onChangeText={setContent}></TextInput>
                <Button title='Gửi' color="#6200ee" onPress={()=> sendComment(content)}></Button>
            </View></>}
            </ScrollView>

            {!isMe && <View style={styles.userContainer}>
                <Text style={styles.userName}>
                    {item.user.first_name} {item.user.last_name}
                </Text>
                <Text>{item.user.phone}</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={handleChatPress} style={styles.chatButton}>
                        <FontAwesome name="comments" size={24} color="blue" />
                        <Text style={styles.chatText}>Chat</Text>
                    </TouchableOpacity>
                    {follow ? (
                        <TouchableOpacity onPress={followUser} style={styles.chatFollow}>
                            <FontAwesome name="user-times" size={24} color="blue" />
                            <Text style={styles.chatText}>UnFollow</Text>
                        </TouchableOpacity>
                    ): (
                        <TouchableOpacity onPress={followUser} style={styles.chatFollow}>
                            <FontAwesome name="user-plus" size={24} color="blue" />
                            <Text style={styles.chatText}>Follow</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={handleCall} style={styles.callButton}>
                        <FontAwesome name="phone" size={24} color="green" />
                        <Text style={styles.callText}>Call</Text>
                    </TouchableOpacity>
                </View>
            </View>}
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    commentContainer: {
        marginTop: 20,
    },
    commentItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    location: {
        fontSize: 16,
        marginBottom: 5,
    },
    createdAt: {
        fontSize: 16,
        marginBottom: 5,
    },
    deposit: {
        fontSize: 16,
        marginBottom: 5,
    },
    numberPeople: {
        fontSize: 16,
        marginBottom: 5,
    },
    state: {
        fontSize: 16,
        marginBottom: 5,
    },
    userContainer: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        padding: 15,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chatButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatText: {
        marginLeft: 5,
        fontSize: 16,
        color: 'blue',
    },
    chatFollow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    callText: {
        marginLeft: 5,
        fontSize: 16,
        color: 'green',
    },
    content: {
        fontSize: 16,
        marginTop: 10,
    },
    seeMore: {
        fontSize: 16,
        color: 'blue',
        marginTop: 5,
    },
    map: {
        width: '100%',
        height: 200,
        marginTop: 10,
    }
});

export default ArticleLookingDetails;