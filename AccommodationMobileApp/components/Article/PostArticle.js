import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { Dropdown } from 'react-native-paper-dropdown';
import { PaperProvider, Card, Title } from 'react-native-paper';

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

    const handleSubmit = () => {
        const data = new FormData();
        data.append('title', title);
        data.append('content', content);
        data.append('contact', contact);
        data.append('number_people', numberPeople);
        data.append('deposit', deposit);
        data.append('area', area);
        data.append('province', selectedProvince);
        data.append('district', selectedDistrict);

        axios.post('http://your-django-api-url/house-articles/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log('Article posted:', response.data);
            })
            .catch(error => {
                console.error('Error posting article:', error);
            });
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
