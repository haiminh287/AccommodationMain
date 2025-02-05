import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity, Image, Platform } from 'react-native';
import { PaperProvider, TextInput, Button, Searchbar, Banner, Appbar } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import Article from '../Article/Article';
import APIs, { endpoints } from '../../configs/APIs';
import ArticleLooking from '../Article/ArticleLooking';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { baseStyle } from '../../styles/Styles.js';
const Home = () => {
    const [articles, setArticles] = useState([]);

    const [selectedType, setSelectedType] = useState('acquistion-articles');
    const [numPeople, setNumPeople] = useState('');
    const [price, setPrice] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [q, setQ] = useState(null);

    const [visibleSearching, setVisibleSearching] = useState(false);

    const [loading, setLoading] = useState(false);

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

    const loadHouseArticles = async () => {
        setLoading(true);
        let url = `${endpoints[selectedType]}`;
        if (numPeople || price || selectedDistrict || selectedProvince) {
            url += '?' + 'number_people=' + numPeople + '&deposit=' + price + '&district=' + selectedDistrict + '&province=' + selectedProvince;
        }
        try {
            const res = await APIs.get(url);
            setArticles(res.data);
        } catch (error) {
            console.error("Error fetching articles:", error);
        } finally {
            setLoading(false);
        }
    };
    const search = (value, callback) => {
        callback(value)
    }
    useEffect(() => {
        loadHouseArticles();
    }, [selectedType]);

    useEffect(() => {
        console.log("numPeople", numPeople);
        let timer = setTimeout(() => loadHouseArticles(), 300);

        return () => clearTimeout(timer);
    }, [numPeople, price, selectedProvince, selectedDistrict]);

    const renderItem = ({ item }) => (
        selectedType === 'acquistion-articles' ? <Article item={item} /> : <ArticleLooking item={item} />
    );

    const options = [
        { label: "Bài Viết Tìm Trọ", value: "looking-articles" },
        { label: "Bài Viết Cho Thuê", value: "acquistion-articles" },
    ];


    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

    return (

        <PaperProvider>

            <LinearGradient
                colors={['#ff9a9e', '#fad0c4']}
                style={baseStyle.container}
            >



                <View style={styles.headerContainer}>
                    {/* Hiệu ứng blur */}
                    {/* <BlurView style={styles.blur} blurType="light" blurAmount={10} /> */}

                    {/* Appbar có hiệu ứng trong suốt */}
                    <Appbar.Header style={styles.headerApp}>
                        <Appbar.Content title="Home" titleStyle={baseStyle.title} />
                        <Appbar.Action icon="magnify" onPress={() => { setVisibleSearching(!visibleSearching) }} />
                        <Appbar.Action icon="dots-vertical" onPress={() => { }} />
                    </Appbar.Header>
                </View>

                <View style={baseStyle.container}>

                    {
                        visibleSearching ?
                            <View key={"display"}>
                                <Dropdown
                                    label={"Chọn loại bài viết"}
                                    mode={"outlined"}
                                    value={selectedType}
                                    onSelect={setSelectedType}
                                    options={options}
                                    style={styles.dropdown}
                                />
                                {selectedType === 'acquistion-articles' && (
                                    <>
                                        <Dropdown
                                            label="Chọn Tỉnh"
                                            mode="outlined"
                                            value={selectedProvince}
                                            onSelect={setSelectedProvince}
                                            options={provinces}
                                            style={styles.dropdown}
                                        />
                                        {selectedProvince && (
                                            <>
                                                <Dropdown
                                                    label="Chọn Quận/Huyện"
                                                    mode="outlined"
                                                    value={selectedDistrict}
                                                    onSelect={setSelectedDistrict}
                                                    options={districts}
                                                    style={styles.dropdown}
                                                />
                                            </>
                                        )}
                                        <TextInput
                                            label="Số lượng người ở"
                                            value={numPeople}
                                            onChangeText={t => search(t, setNumPeople)}
                                            keyboardType="numeric"
                                            style={styles.input}
                                        />
                                        <TextInput
                                            label="Mức giá mong muốn (2000000 - 2tr)"
                                            value={price}
                                            onChangeText={setPrice}
                                            keyboardType="numeric"
                                            style={styles.input}
                                        />
                                    </>
                                )}
                            </View>
                            : <></>
                    }

                    <FlatList
                        data={articles}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
                        showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang (nếu cần)
                    />
                </View>

            </LinearGradient>

        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Nền mờ
        borderRadius: 20, // Bo góc mềm mại
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Hiệu ứng trong suốt nhẹ
        borderRadius: 10,
        padding: 10,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 10,
        padding: 10,
    },
    button: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        backdropFilter: 'blur(10px)',
    },
    text: { color: '#fff', fontSize: 18 },
    headerContainer: {
        // position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    blur: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 20,
    },
    headerApp: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Trong suốt
        borderRadius: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },

});

export default Home;