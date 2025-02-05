import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, DataTable, IconButton } from 'react-native-paper';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const PostHistory = () => {
    const [articles, setArticles] = useState([]);
    const [state, setState] = useState('Chờ Kiểm Duyệt');
    const nav = useNavigation();

    const loadHouseArticles = async () => {
        const token = await AsyncStorage.getItem('token');
        let url = `${endpoints['post-history']}`;
        if (state) {
            url += `?state=${state}`;
        }
        const res = await authApis(token).get(url);
        setArticles(res.data);
    };


    useEffect(() => {
        loadHouseArticles();
    }, [state]);

    const renderItem = ({ item }) => (
        <DataTable.Row>
            <DataTable.Cell style={{ flex: 1 }}>{item.id}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 5 }}>{item.title}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 3, alignItems: 'center' }}>
                <Text style={styles.statusText(item.state)}>{item.state}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 2 }}>
                <IconButton 
                    icon="eye" 
                    size={22} 
                    iconColor="#007bff"
                    onPress={() => nav.navigate('articleLookingDetails', { item, isMe: true })}
                />
            </DataTable.Cell>

            <DataTable.Cell style={{ flex: 1.2 }}>
                <IconButton 
                    icon="delete" 
                    size={22} 
                    iconColor="#007bff"
                   
                />
            </DataTable.Cell>
        </DataTable.Row>
    );

    return (
        <View style={styles.container}>

            {/* Bộ lọc trạng thái */}
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

            {/* Bảng dữ liệu */}
            <ScrollView showsVerticalScrollIndicator>
                <View style={styles.tableContainer}>
                    <DataTable style={styles.table}>
                        <DataTable.Header>
                            <DataTable.Title style={{ flex: 1 }}>ID</DataTable.Title>
                            <DataTable.Title style={{ flex: 5 }}>Tiêu Đề</DataTable.Title>
                            <DataTable.Title style={{ flex: 3 }}>Trạng Thái</DataTable.Title>
                            <DataTable.Title style={{ flex: 2 }}>Chi Tiết</DataTable.Title>
                            <DataTable.Title style={{ flex: 1 }}>Xóa</DataTable.Title>
                        </DataTable.Header>
                        <FlatList
                            data={articles}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()}
                        />
                    </DataTable>
                </View>
            </ScrollView>
        </View>
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

export default PostHistory;
