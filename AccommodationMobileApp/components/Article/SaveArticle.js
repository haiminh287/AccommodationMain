import { FlatList, ScrollView, Text, View } from "react-native"
import APIs, { authApis, endpoints } from "../../configs/APIs";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Article from "./Article";
import { RefreshContext } from "../../configs/RefreshContexts";

const SaveArticle = ()=> {
    const [articles, setArticles] = useState([]);
    const refresh = useContext(RefreshContext);
    const loadHouseArticles = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        if(token){
            const res =  await authApis(token).get(endpoints['user-like-house']);
            console.log('data',res.data);
            setArticles(res.data);
        }
        else{
          try{
            const res =  await APIs.get(endpoints['user-like-house']);
            console.log('data',res.data);
            setArticles(res.data);
          }
          catch(e){
            console.log(e);
          }
        }

    }
    useEffect(()=>{
        loadHouseArticles();
    }, [refresh]);
    const renderItem = ({ item }) => (
        item.house ? <Article item={item.house} isLike={true} /> : <Article item={item} isLike={true} />
  );
    
      return (
        <FlatList
          data={articles}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      );
}
export default SaveArticle;