import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, DataTable, Button } from 'react-native-paper';
import axios from 'axios';
import APIs, { endpoints } from '../../configs/APIs';

const AllArticle = () => {
    const [articles, setArticles] = useState([]);
    const [state, setState] = useState('');
    const loadHouseArticles = async () =>{
        let url = `${endpoints['house-articles']}`;
        if (state) {
            url += `?state=${state}`;
        }
        const res = await APIs.get(url);
        console.log(res.data);
        setArticles(res.data);
    }

    useEffect(() => {
        loadHouseArticles();
    }, [state]);

    

    const renderItem = ({ item }) => (
        <DataTable.Row>
            <DataTable.Cell>{item.id}</DataTable.Cell>
            <DataTable.Cell>{item.title}</DataTable.Cell>
            <DataTable.Cell>{item.status}</DataTable.Cell>
        </DataTable.Row>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>All Articles</Text>
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={() => setState('all')} style={styles.button}>
                Tất Cả
                </Button>
                <Button mode="contained" onPress={() => setState('published')} style={styles.button}>
                Chờ Kiểm Duyệt
                </Button>
                <Button mode="contained" onPress={() => setState('archived')} style={styles.button}>
                Đã Kiểm Duyệt
                </Button>
                <Button mode="contained" onPress={() => setState('')} style={styles.button}>
                Đã Hủy
                </Button>
            </View>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>ID</DataTable.Title>
                    <DataTable.Title>Title</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
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
    },
    button: {
        marginHorizontal: 5,
    },
});

export default AllArticle;