import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";
import { LinearGradient } from "expo-linear-gradient";
import { baseStyle } from "../../styles/Styles";

const UserProfile = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: "logout" });
    nav.navigate("home");
  };

  const postArticle = () => nav.navigate("postArticle");
  const postArticleLooking = () => nav.navigate("postArticleLooking");
  const viewReport = () => nav.navigate("report");
  const viewListArticle = () => nav.navigate("listAllArticle");
  const viewPostHistory = () => nav.navigate("postHistory");

  const renderButton = (title, onPress) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.touchable}>
      <LinearGradient colors={['#FF7EB3', '#D291BC']} style={styles.gradientButton}>
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#ff9a9e', '#fad0c4']} style={baseStyle.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={baseStyle.marginSpace} />
        <View style={styles.card}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{user.username}</Text>
              <Text style={styles.paragraph}>Email: {user.email}</Text>
              <Text style={styles.paragraph}>Họ: {user.first_name}</Text>
              <Text style={styles.paragraph}>Tên: {user.last_name}</Text>
              <Text style={styles.paragraph}>Số điện thoại: {user.phone}</Text>
              <Text style={styles.role}>{user.is_superuser ? 'Quản Trị Viên' : user.user_role}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {renderButton("Đăng xuất", logout)}

            {user.user_role === "Chủ Nhà Trọ" && (
              <>
                {renderButton("Đăng bài", postArticle)}
                {renderButton("Lịch Sử Đăng Bài", viewPostHistory)}
              </>
            )}

            {user.user_role === "Người Tìm Trọ" && !user.is_superuser && (
              <>
                {renderButton("Đăng bài", postArticleLooking)}
                {renderButton("Lịch Sử Đăng Bài", viewPostHistory)}
              </>
            )}

            {user.is_superuser && (
              <>
                {renderButton("Xem Báo Cáo", viewReport)}
                {renderButton("Kiểm Duyệt Bài", viewListArticle)}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoContainer: {
    marginLeft: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
  },
  role: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D291BC',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  touchable: {
    width: '80%',
    marginBottom: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default UserProfile;
