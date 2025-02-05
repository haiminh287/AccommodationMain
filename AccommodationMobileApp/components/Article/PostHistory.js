import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, DataTable, Icon, IconButton } from 'react-native-paper';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const PostHistory = () => {
    const [articles, setArticles] = useState([]);
    const [state, setState] = useState('');
    const nav = useNavigation();
    const loadHouseArticles = async () => {
        const token = await AsyncStorage.getItem('token');
        let url = `${endpoints['post-history']}`;
        if (state) {
            url += `?state=${state}`;
        }
        const res = await authApis(token).get(url);
        setArticles(res.data);
    }


    useEffect(() => {
        loadHouseArticles();
    }, [state]);

    const renderItem = ({ item }) => (
        <DataTable.Row>
            <DataTable.Cell style={{ flex: 1 }}>{item.id}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 5 }}>{item.title}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 4 }}>{item.state}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0 }}>
                    <TouchableOpacity onPress={ ()=>nav.navigate('articleLookingDetails',{item:item,isMe:true})}>
                        <IconButton icon="details" />
                    </TouchableOpacity>
            </DataTable.Cell>
        </DataTable.Row>
    );

    return (
        <View style={styles.container}>
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
                    <DataTable.Title style={{ flex: 0 }}>Chi Tiết</DataTable.Title>
                </DataTable.Header>
                <FlatList
                    data={articles}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            </DataTable>
        </View>
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

export default PostHistory;