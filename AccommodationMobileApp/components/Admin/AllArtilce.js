import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, DataTable, Icon, IconButton, PaperProvider } from 'react-native-paper';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-paper-dropdown';
const AllArticle = () => {
    const [articles, setArticles] = useState([]);
    const [selectedType, setSelectedType] = useState('acquistion-articles');
    const [state, setState] = useState('Chờ Kiểm Duyệt');
    const nav = useNavigation();
    const loadHouseArticles = async () => {
        let url = `${endpoints[selectedType]}`;
        if (state) {
            url += `?state=${state}`;
        }
        const res = await APIs.get(url);
        console.log(res.data);
        setArticles(res.data);
    }
    const updateState = async(id, state) => {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        let detail =selectedType==="acquistion-articles"?"acquistion-article":"looking-article";
        console.log(detail);
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
                {item.state !== 'Đã Duyệt'  && (
                    <TouchableOpacity onPress={() => updateState(item.id, 'Đã Duyệt')}>
                        <IconButton icon="check-bold" />
                    </TouchableOpacity>
                )}
            </DataTable.Cell>
            
            {selectedType==="acquistion-articles"?<DataTable.Cell style={{ flex: 2}}>
                    <TouchableOpacity onPress={ ()=>nav.navigate('articleDetails',{item:item})}>
                        <IconButton icon="eye" />
                    </TouchableOpacity>
            </DataTable.Cell>:<DataTable.Cell style={{ flex: 2 }}>
                    <TouchableOpacity onPress={ ()=>nav.navigate('articleLookingDetails',{item:item})}>
                        <IconButton icon="eye" />
                    </TouchableOpacity>
            </DataTable.Cell>}
            <DataTable.Cell style={{ flex: 0 }}>
                { item.state !== 'Đã Hủy' && (
                    <TouchableOpacity onPress={() => updateState(item.id, 'Đã Hủy')}>
                        <IconButton icon="cancel" />
                    </TouchableOpacity>
                )}
            </DataTable.Cell>
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
            

            <View style={styles.filterContainer}>
                <View style={styles.buttonContainer}>
                    {['Chờ Kiểm Duyệt', 'Đã Duyệt', 'Đã Hủy'].map(status => (
                        <TouchableOpacity 
                            key={status} 
                            onPress={() => setState(status)}
                            style={[styles.button, state === status && styles.activeButton]}
                        >
                            <Text style={[styles.buttonText, state === status && styles.activeButtonText]}>
                                {status === 'Chờ Kiểm Duyệt' ? 'Chờ Duyệt' : status === 'Đã Duyệt' ? 'Đã Duyệt' : 'Đã Hủy'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
                <View style={styles.tableContainer}>
                    <DataTable style={styles.table}>
                        <DataTable.Header>
                            <DataTable.Title style={{ flex: 1 }}>ID</DataTable.Title>
                            <DataTable.Title style={{ flex: 5 }}>Tiêu Đề</DataTable.Title>
                            <DataTable.Title style={{ flex: 4 }}>Trạng Thái</DataTable.Title>
                            <DataTable.Title style={{ flex: 2 }}>Duyệt</DataTable.Title>
                            <DataTable.Title style={{ flex: 3 }}>Chi Tiết</DataTable.Title>
                            <DataTable.Title style={{ flex: 1.5 }}>Hủy</DataTable.Title>
                        </DataTable.Header>
                        <FlatList
                            data={articles}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()}
                        />
                    </DataTable>
                </View>
        </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    filterContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 3,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    activeButton: {
        backgroundColor: '#007bff',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    activeButtonText: {
        color: '#fff',
    },
    tableContainer: {
        width: '100%',
        marginTop: 20,
        alignSelf: 'center',
    },
    table: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        overflow: 'hidden',
    },
    statusText: (status) => ({
        fontSize: 14,
        fontWeight: 'bold',
        color: status === 'PENDING' ? 'orange' : status === 'CONFIRM' ? 'green' : 'red',
    }),
});

export default AllArticle;