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
                "client_id": "Uzr75ssE97eipbBP5hhHimfq2R00gawX47okqA51",
                "client_secret": "wmq9DI2W05UelNgoyVQqARIEtWHeSuQRmf9MTBGMKiRkGAL45KlKvYMhyiNOxmHmVDliirInN7pT171aTgS2QKZg8rit0qhgTIbPc2qulMxA8441igBn4qIpbP0ImXJZ",
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