import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native"
import { Button, TextInput, HelperText, RadioButton } from "react-native-paper";
import Styles from "../../styles/Styles"
import * as ImagePicker from 'expo-image-picker';
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../configs/Firebase";

const Register = () => {
    const [user, setUser] = useState({});
    const [checked, setChecked] = useState("Người Tìm Trọ")
    const users = {
        "first_name": {
            "title": "Tên",
            "field": "first_name",
            "icon": "text",
            "secureTextEntry": false
        },
        "last_name": {
            "title": "Họ và tên lót",
            "field": "last_name",
            "icon": "text",
            "secureTextEntry": false
        },
        "username": {
            "title": "Tên đăng nhập",
            "field": "username",
            "icon": "text",
            "secureTextEntry": false
        }, "phone": {
            "title": " Số Điện Thoại (+84334387872)",
            "field": "phone",
            "icon": "phone",
            "secureTextEntry": false
        },"email": {
            "title": "Email",
            "field": "email",
            "icon": "email",
            "secureTextEntry": false
        },"password": {
            "title": "Mật khẩu",
            "field": "password",
            "icon": "eye",
            "secureTextEntry": true
        }, "confirm": {
            "title": "Xác nhận mật khẩu",
            "field": "confirm",
            "icon": "eye",
            "secureTextEntry": true
        }
    }
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);

    const change = (value, field) => {
        setUser({...user, [field]: value});
    }

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                change(result.assets[0], 'avatar');
            }
        }

    const register = async () => {
        if (user.password !== user.confirm)
            setErr(true);
        else {
            setErr(false);
            let form = new FormData();
            console.info("user",user)
            for (let key in user)
                if (key !== 'confirm') {
                    if (key === 'avatar') {
                        form.append('avatar', {
                            uri: user.avatar.uri,
                            name: user.avatar.fileName,
                            type: user.avatar.mimeType
                        })
                    } else
                        form.append(key, user[key]);
                }
            form.append('user_role',checked)
            console.info(form)

                
            setLoading(true);
            try {
                let res = await APIs.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.info(res.data)
                if (res.data && res.data.id) {
                    try {
                        const userData = {
                            "id": res?.data?.id,
                            "username": res.data.username,
                            "first_name": res.data.first_name,
                            "last_name": res.data.last_name,
                            "avatar": res.data.avatar
                        };
                    
                        // Log userData to check values
                        console.info("User data to be written:", userData);
                    
                        await setDoc(doc(db, "users", String(userData.id)), userData);
                        console.info("User document successfully written!");
                    } catch (error) {
                        console.error("Error writing user document: ", error);
                    }
                } else {
                    console.error("Invalid response data:", res.data);
                }
                nav.navigate("login");
            } catch (ex) {
                console.error(JSON.stringify(ex));
            } finally {
                setLoading(false);
            }
        }
    }
    
    return (
        <ScrollView style={Styles.container}>
            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <HelperText type="error" visible={err}>
                Mật khẩu KHÔNG khớp
                </HelperText>
            
                {Object.values(users).map(u => <TextInput secureTextEntry={u.secureTextEntry} key={u.field} value={user[u.field]} onChangeText={t => change(t, u.field)} 
                style={Styles.margin} placeholder={u.title} right={<TextInput.Icon icon={u.icon} />} />)}

                
                <TouchableOpacity onPress={pickImage}>
                    <Text style={Styles.margin}>Chọn ảnh đại diện...</Text>
                </TouchableOpacity>

                {user.avatar ? <Image source={{ uri: user.avatar.uri }} style={{ width: 100, height: 100 }} /> : ""}

                <RadioButton.Group onValueChange={value => setChecked(value)} value={checked}>
                <View style={Styles.radioContainer}>
                    {["Người Tìm Trọ","Chủ Nhà Trọ"].map(option => (
                    <View key={option} style={Styles.radioItem}>
                        <RadioButton value={option} />
                        <Text>{option}</Text>
                    </View>
                    ))}
                </View>
                </RadioButton.Group>
                <Button loading={loading} mode="contained" onPress={register}>ĐĂNG KÝ</Button>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

export default Register;