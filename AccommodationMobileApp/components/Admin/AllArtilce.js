import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, DataTable, Icon, IconButton, PaperProvider } from 'react-native-paper';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-paper-dropdown';
const AllArticle = () => {
    const [articles, setArticles] = useState([]);
    const [selectedType, setSelectedType] = useState('acquistion-articles');
    const [state, setState] = useState('');
    const nav = useNavigation();
    const loadHouseArticles = async () => {
        let url = `${endpoints[selectedType]}`;
        if (state) {
            url += `?state=${state}`;
        }
        const res = await APIs.get(url);
        setArticles(res.data);
    }
    const updateState = async(id, state) => {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        let detail =selectedType==="acquistion-articles"?"acquistion-article":"looking-article";
        try {
        const res = await authApis(token).patch(endpoints[detail](id), {state: state});
        } catch (error) {
            console.error("Error updating state:", error);
        }
        console.log(res.data);
        setState(res.data.state);
    }


    useEffect(() => {
        loadHouseArticles();
    }, [state,selectedType]);

    const renderItem = ({ item }) => (
        <DataTable.Row>
            <DataTable.Cell style={{ flex: 1 }}>{item.id}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 5 }}>{item.title}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 4 }}>{item.state}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 2 }}>
                {item.state !== 'CONFIRM' && item.state !== 'CANCEL' && (
                    <TouchableOpacity onPress={() => updateState(item.id, 'CONFIRM')}>
                        <IconButton icon="check-bold" />
                    </TouchableOpacity>
                )}
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 2.5 }}>
                {item.state !== 'CONFIRM' && item.state !== 'CANCEL' && (
                    <TouchableOpacity onPress={() => updateState(item.id, 'CANCEL')}>
                        <IconButton icon="cancel" />
                    </TouchableOpacity>
                )}
            </DataTable.Cell>
            {selectedType==="acquistion-articles"?<DataTable.Cell style={{ flex: 0 }}>
                    <TouchableOpacity onPress={ ()=>nav.navigate('articleDetails',{item:item})}>
                        <IconButton icon="details" />
                    </TouchableOpacity>
            </DataTable.Cell>:<DataTable.Cell style={{ flex: 0 }}>
                    <TouchableOpacity onPress={ ()=>nav.navigate('articleLookingDetails',{item:item})}>
                        <IconButton icon="details" />
                    </TouchableOpacity>
            </DataTable.Cell>}
        </DataTable.Row>
    );
    const options = [
        { label: "Bài Viết Tìm Trọ", value: "looking-articles" },
        { label: "Bài Viết Cho Thuê", value: "acquistion-articles" },
    ];
    return (
        <PaperProvider>
        <View style={styles.container}>
            <Dropdown
                    label={"Chọn loại bài viết"}
                    mode={"outlined"}
                    value={selectedType}
                    onSelect={setSelectedType}
                    options={options}
                />
            

            <View style={styles.buttonContainer}>
            {/* <TouchableOpacity 
                    onPress={() => setState('')} 
                    style={[styles.button, state === '' && styles.activeButton]}>
                    <Text style={[styles.buttonText, state === '' && styles.activeButtonText]}>Tất Cả</Text>
                </TouchableOpacity> */}
                <TouchableOpacity 
                    onPress={() => setState('PENDING')} 
                    style={[styles.button, state === 'PENDING' && styles.activeButton]}>
                    <Text style={[styles.buttonText, state === 'PENDING' && styles.activeButtonText]}>Chờ Kiểm Duyệt</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setState('CONFIRM')} 
                    style={[styles.button, state === 'CONFIRM' && styles.activeButton]}>
                    <Text style={[styles.buttonText, state === 'CONFIRM' && styles.activeButtonText]}>Đã Kiểm Duyệt</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setState('CANCEL')} 
                    style={[styles.button, state === 'CANCEL' && styles.activeButton]}>
                    <Text style={[styles.buttonText, state === 'CANCEL' && styles.activeButtonText]}>Đã Hủy</Text>
                </TouchableOpacity>
            </View>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title style={{ flex: 1 }}>ID</DataTable.Title>
                    <DataTable.Title style={{ flex: 5 }}>Tiêu Đề</DataTable.Title>
                    <DataTable.Title style={{ flex: 4 }}>Trạng Thái</DataTable.Title>
                    <DataTable.Title style={{ flex: 2 }}>Duyệt</DataTable.Title>
                    <DataTable.Title style={{ flex: 2 }}>Hủy</DataTable.Title>
                    <DataTable.Title style={{ flex: 0 }}>Chi Tiết</DataTable.Title>
                </DataTable.Header>
                <FlatList
                    data={articles}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            </DataTable>
        </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        backgroundColor: '#ffffff',
    },
    button: {
        marginHorizontal: 5,
        padding: 12,
    },
    activeButton: {
        borderBottomWidth: 2,
        borderBottomColor: 'red',
        color: 'red',
    },
    activeButtonText: {
        color: 'red',
    },
});

export default AllArticle;