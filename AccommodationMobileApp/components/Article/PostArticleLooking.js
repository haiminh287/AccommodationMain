import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button, PaperProvider, TextInput, Card, Divider, Text } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import APIs, { authApis, endpoints } from "../../configs/APIs";

const PostArticleLooking = () => {
    const [lookingArticle, setLookingArticle] = useState({});
    const navigation = useNavigation();

    const setLookingArticleSupport = (key, value) => {
        setLookingArticle({ ...lookingArticle, [key]: value });
    };

    const display_props_article = {
        title: "Tiêu Đề",
        content: "Nội Dung",
        contact: "Liên Hệ",
        deposit: "Giá",
        area: "Diện Tích",
        location: "Địa Chỉ",
        number_people: "Số Lượng Người Ở"
    };

    const typeAcquisitionOptions = [
        { label: "Thuê nhà", value: 'ren' },
        { label: "Mua nhà", value: 'buy' },
        { label: "Đặt trước", value: 'odr' }
    ];
    const typeHouseOptions = [
        { label: 'Chung cu', value: 'apar' },
        { label: 'Nha rieng', value: 'home' },
        { label: 'Nha mac pho', value: 'strh' },
        { label: 'Biet thu', value: 'vill' },
        { label: 'Shop', value: 'shph' },
        { label: 'Van phong', value: 'offc' },
        { label: 'Nha may xi nghiep', value: 'fact' },
        { label: 'Khac', value: 'othr' },

    ]

    const typeOnwershipOptions = [
        { label: 'Nguyen can', value: 'full' },
        { label: 'Mot phan', value: 'part' },
        { label: 'Mot phong', value: 'room' },
        { label: 'Mot tang', value: 'flor' },

    ]

    const interiorStateOptions = [
        { label: 'Chua co', value: 'noye' },
        { label: 'Co san', value: 'have' },

    ]


    const advanced_props_article = {
        type_acquisition: {
            label: "Loai giao dich",
            placeholder: "Select ...",
            mode: "outlined",
            options: typeAcquisitionOptions,
            value: lookingArticle.type_acquisition,
            onSelect: (t) => { setLookingArticleSupport('type_acquisition', t) },
        },
        interior_state: {
            label: "Tình Trạng Nội Thất",
            placeholder: "Select ...",
            mode: "outlined",
            options: interiorStateOptions,
            value: lookingArticle.interior_state,
            onSelect: (t) => { setLookingArticleSupport('interior_state', t) },
        },
        type_house: {
            label: "Loại Nhà",
            placeholder: "Select ...",
            mode: "outlined",
            options: typeHouseOptions,
            value: lookingArticle.type_house,
            onSelect: (t) => { setLookingArticleSupport('type_house', t) },
        },
        type_onwership: {
            label: "Loai so huu",
            placeholder: "Select ...",
            mode: "outlined",
            options: typeOnwershipOptions,
            value: lookingArticle.type_onwership,
            onSelect: (t) => { setLookingArticleSupport('type_onwership', t) },
        },

    }
    const postLookingArticleAPI = async () => {
        let form = new FormData();
        Object.entries(lookingArticle).forEach(([k, v]) => form.append(k, v));
        form.append('active', true);
        form.append('looking_state', true);
        form.append('house_state', 'em');

        let token = await AsyncStorage.getItem("token");
        try {
            let res = await authApis(token).post(endpoints['looking-articles'], form, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res?.status === 201) {
                console.log(res.data);
                alert("Successfully Submitted");
            } else {
                alert("Error while submitting");
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <PaperProvider>
            <ScrollView style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        {Object.entries(display_props_article).map(([key, label]) => (
                            <TextInput key={key} label={label} style={styles.input} value={lookingArticle[key]} onChangeText={(t) => setLookingArticleSupport(key, t)} />
                        ))}
                        {Object.entries(advanced_props_article).map(([key, label]) => (
                            <Dropdown key={key} {...label} />
                        ))}
                    </Card.Content>
                    <Divider style={styles.divider} />
                    <Card.Actions>
                        <Button mode="contained" onPress={postLookingArticleAPI} style={styles.button}>SUBMIT</Button>
                    </Card.Actions>
                </Card>
            </ScrollView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    card: { marginBottom: 20, padding: 10 },
    input: { marginBottom: 10 },
    button: { marginTop: 10, width: '100%' },
    divider: { marginVertical: 10 }
});

export default PostArticleLooking;
