import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { Dropdown } from 'react-native-paper-dropdown';
import { PaperProvider, Card, Title, Icon } from 'react-native-paper';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/UserContexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Styles from '../../styles/Styles';
import * as ImagePicker from 'expo-image-picker';

const PostArticle = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [contact, setContact] = useState('');
    const [numberPeople, setNumberPeople] = useState('');
    const [deposit, setDeposit] = useState('');
    const [area, setArea] = useState('');
    const [location, setLocation] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [images, setImages] = useState([]);
    const user = useContext(MyUserContext);
    const navigation = useNavigation();

    const loadProvinces = async () => {
        try {
            const res = await axios.get('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1');
            setProvinces(res.data.data.data.map(province => ({
                label: province.name_with_type,
                value: province.code
            })));
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const loadDistricts = async (provinceCode) => {
        try {
            const res = await axios.get(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`);
            setDistricts(res.data.data.data.map(district => ({
                label: district.name_with_type,
                value: district.code
            })));
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    useEffect(() => {
        loadProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            loadDistricts(selectedProvince);
        }
    }, [selectedProvince]);

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
                try{
                    setImages([...images, ...result.assets]);
                    console.log('image',images);
                }
                catch (e) {
                    console.log(e);
              }
            }
        }
        }
    const handleSubmit = async () => {
        const data = new FormData();
        data.append('title', title);
        data.append('content', content);
        data.append('contact', contact);
        data.append('location', location)
        data.append('number_people', parseInt(numberPeople));
        data.append('deposit', parseFloat(deposit));
        data.append('area', area);
        data.append('city', selectedProvince);
        data.append('district', selectedDistrict);
        data.append('user', user);
        data.append('stateAcqui', true);
        data.append('active', true);
        images.forEach((image, index) => {
            data.append('images', {
                uri: image.uri,
                type:image.mimeType , 
                name:image.fileName
            });
        });
        console.log('data', data);
        // if(images.length <3){
        //     Alert.alert("Please upload at least 3 images");
        //     return;
        // }
        let token = await AsyncStorage.getItem('token', null)
        console.log(`token: ${token}`)
        let res = null

        // navigation.navigate('profile')

        if (token) {
            try {
                res = await authApis(token).post(endpoints['acquistion-articles'], data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
                console.log('main-data',res.data);
                
            } catch (e) {
                console.log(e);
            }
            finally {
                if (res?.status === 201) {
                    alert(`${res.statusText}: Da tao thanh cong tai khoan`);
                }
                else
                    alert(`${res.statusText}: Xay ra loi trong qua trinh tao`);
            }
        }
        else
            alert(`error: Cann't get token when loading`);
        
        console.log('end');
    };

    return (
        <PaperProvider>
            <ScrollView contentContainerStyle={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.header}>Post Article</Title>

                        <TextInput style={styles.input} placeholder="Tiêu Đề" value={title} onChangeText={setTitle} />
                        <TextInput style={[styles.input, styles.textArea]} placeholder="Nội Dung" value={content} onChangeText={setContent} multiline={true} numberOfLines={4} />
                        <TextInput style={styles.input} placeholder="Liên Hệ" value={contact} onChangeText={setContact} />
                        <TextInput style={styles.input} placeholder="Số Người Có Thể Ở" value={numberPeople} onChangeText={setNumberPeople} keyboardType="numeric" />
                        <TextInput style={styles.input} placeholder="Giá Cho Thuê" value={deposit} onChangeText={setDeposit} keyboardType="numeric" />
                        <TextInput style={styles.input} placeholder="Diện Tích" value={area} onChangeText={setArea} />

                        <Dropdown
                            label="Chọn Tỉnh"
                            mode="outlined"
                            value={selectedProvince}
                            onSelect={setSelectedProvince}
                            options={provinces}
                            style={styles.dropdown}
                        />

                        {selectedProvince && (
                            <Dropdown
                                label="Chọn Quận/Huyện"
                                mode="outlined"
                                value={selectedDistrict}
                                onSelect={setSelectedDistrict}
                                options={districts}
                                style={styles.dropdown}
                            />
                        )}

                        {selectedDistrict && <TextInput style={styles.input} placeholder="Địa Chỉ" value={location} onChangeText={setLocation} />}
                        <TouchableOpacity onPress={pickImage}>
                            <Text style={Styles.margin}><Icon source="camera"></Icon>Chọn ảnh </Text>
                        </TouchableOpacity>

                        <View style={styles.imageContainer}>
                        {images.map((image, index) => (
                            <Image key={index} source={{ uri: image.uri }} style={{ width: 100, height: 100 }} />
                        ))}
                        </View>
                    </Card.Content>
                </Card>
                <Button title="Đăng Bài" onPress={handleSubmit} color="#6200ee" style={styles.button} />
            </ScrollView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap', 
        overflow: 'scroll', 
      },
      image: {
        width: 100,
        height: 100,
        marginRight: 8,
      },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#6200ee',
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 12,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginTop: 5,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    dropdown: {
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        width: '100%',
    },
});

export default PostArticle;