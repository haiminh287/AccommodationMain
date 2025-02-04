import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import { MyDispatchContext } from "../../configs/UserContexts";
import Styles from "../../styles/Styles";
import { db } from "../../configs/Firebase";


const Login = () => {
    const [user, setUser] = useState({
        "username": "",
        "password": ""
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigation();
    const route = useRoute();
    const { redirect, params } = route.params || {};
    const users = {
        "username": {
            "title": "Tên đăng nhập",
            "field": "username",
            "secure": false,
            "icon": "text"
        },  "password": {
            "title": "Mật khẩu",
            "field": "password",
            "secure": true,
            "icon": "eye"
        }
    }

    const updateUser = (value, field) => {
        setUser({...user, [field]: value});
    }
    

    const login = async () => {
        try {
            setLoading(true);
            console.info(endpoints['login']);
            let res = await APIs.post(endpoints['login'],{
                "client_id": "QuzlrRcQ8BCfTQCSV8pJjyPf2C598Ph6hbttKyT1",
                "client_secret": "FR99Rfzg9NQz0GeMDVXKRdsF6cNpgd0tbmmKor9wH9cqvbrpTXErr2Ryxq8z99DiOhM2neupcD7LKwBerJJCiK0l7ZR9Si8R9cGYXYEYBAqrCBKvXnjflJrYlYNbymUi",
                "grant_type": "password",
                ...user
            });
            await AsyncStorage.setItem('token', res.data.access_token);
            console.info("===");
            setTimeout(async () => {
                let user = await authApis(res.data.access_token).get(endpoints['current-user']);
                console.info(user.data);
                dispatch({
                    "type": "login",
                    "payload": user.data
                });
                if(redirect){
                    nav.navigate(redirect, params);
                }
                else{
                    nav.navigate("home");
                }
            }, 500);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {Object.values(users).map(u => <TextInput right={<TextInput.Icon icon={u.icon} />} key={u.field} 
                    secureTextEntry={u.secure} style={Styles.margin} placeholder={u.title} 
                    value={user[u.field]}  onChangeText={t => updateUser(t, u.field)}  />)}
            <Button onPress={login} loading={loading} style={Styles.margin} 
                    icon="account-check" mode="contained">Đăng nhập</Button>
        </KeyboardAvoidingView>
    );
}

export default Login;