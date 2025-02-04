import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Button, Card, Title, Paragraph } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";

const UserProfile = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ "type": "logout" });
    nav.navigate("home");
  };

  const postArticle = () => {
    nav.navigate("postArticle");
  };

  const postArticleLooking = () => {
    nav.navigate("postArticleLooking");
  }
  const viewReport = () => {
    nav.navigate("report");
  };

  const viewListArticle = ()=>{
    nav.navigate("listAllArticle");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: `https://res.cloudinary.com/dsz7vteia/${user.avatar}` }}
              style={styles.avatar}
            />
            <View style={styles.infoContainer}>
              <Title style={styles.title}>Chào {user.username}</Title>
              <Paragraph style={styles.paragraph}>Email: {user.email}</Paragraph>
              <Paragraph style={styles.paragraph}>Họ: {user.first_name}</Paragraph>
              <Paragraph style={styles.paragraph}>Tên: {user.last_name}</Paragraph>
              <Paragraph style={styles.paragraph}>Số điện thoại: {user.phone}</Paragraph>
              <Paragraph style={styles.paragraph}>Vai trò: {user.user_role}</Paragraph>
            </View>
          </View>
        </Card.Content>
        <Button onPress={logout} style={styles.button} mode="contained">Đăng xuất</Button>
        {user.user_role === "Chủ Nhà Trọ" ? (
          <Button onPress={postArticle} style={styles.button} mode="contained">Đăng bài</Button>
        ) : (
          <Button onPress={postArticleLooking} style={styles.button} mode="contained">Đăng bài</Button>
        )}
        {user.is_superuser && (<>
          <Button onPress={viewReport} style={styles.button} mode="contained">Xem Báo Cáo</Button>
          <Button onPress={viewReport} style={styles.button} mode="contained">Kiểm Duyệt Bài</Button>
          </>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    borderRadius: 10,
    elevation: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    margin: 8,
  },
});

export default UserProfile;