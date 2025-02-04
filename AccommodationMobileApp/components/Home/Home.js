import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { PaperProvider, TextInput, Button } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import Article from '../Article/Article';
import APIs, { endpoints } from '../../configs/APIs';
import ArticleLooking from '../Article/ArticleLooking';
import axios from 'axios';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [selectedType, setSelectedType] = useState('acquistion-articles');
    const [numPeople, setNumPeople] = useState('');
    const [price, setPrice] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
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
        let province = "";
        let district = "";
        setLoading(true);
        let url = `${endpoints[selectedType]}`;
        if (numPeople || price || selectedDistrict || selectedProvince) {
            for (let i =0; i< provinces.length; i++) {
                if (provinces[i].value === selectedProvince) {
                    province = provinces[i].label;
                    break;
                }
            }
            for (let i =0; i< districts.length; i++) {
                if (districts[i].value === selectedDistrict) {
                    district = districts[i].label;
                    break;
                }
            }
            url += '?' + 'number_people=' + numPeople + '&deposit=' + price + '&district=' + district + '&province=' + province;
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

    useEffect(()=>{
        console.log("numPeople", numPeople);
        let timer = setTimeout(() => loadHouseArticles(), 300);

        return () => clearTimeout(timer);
    },[numPeople, price, selectedProvince, selectedDistrict]);

    const renderItem = ({ item }) => (
        selectedType === 'acquistion-articles' ? <Article item={item} /> : <ArticleLooking item={item} />
    );

    const options = [
        { label: "Bài Viết Tìm Trọ", value: "looking-articles" },
        { label: "Bài Viết Cho Thuê", value: "acquistion-articles" },
    ];
    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.header}>Bài Viết</Text>
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
                <FlatList
                    data={articles}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dropdown: {
        marginBottom: 20,
        marginTop: 20,
    },
    input: {
        marginBottom: 10,
        marginTop: 10,
    },
    button: {
        marginBottom: 20,
    },
});

export default Home;