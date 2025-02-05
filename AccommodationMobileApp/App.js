import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import 'moment/locale/vi';
import Home from './components/Home/Home';
import Login from './components/User/Login';
import Register from './components/User/Register';
import UserProfile from './components/User/UserProfile';
import { MyUserContext,MyDispatchContext } from './configs/UserContexts';
import { useReducer } from 'react';
import MyUserReducers from './configs/UserReducers';
import { NavigationContainer, getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import Chat from './components/Chat/Chat';
import ChatDetails from './components/Chat/ChatDetails';
import PostArticle from './components/Article/PostArticle';
import Article from './components/Article/Article';
import ArticleDetails from './components/Article/ArticleDetails';
import SaveArticle from './components/Article/SaveArticle';
import { MyLikeContext } from './configs/LikeContexts';
import { RefreshProvider } from './configs/RefreshContexts';
import Report from './components/Report/Report';
import PostArticleLooking from './components/Article/PostArticleLooking';
import AllArticle from './components/Admin/AllArtilce';
import ArticleLookingDetails from './components/Article/ArticleLookingDetails';
import PostHistory from './components/Article/PostHistory';

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={Home} />
      <Stack.Screen name="article" component={Article} />
      <Stack.Screen name="articleDetails" component={ArticleDetails} />
      <Stack.Screen name="articleLookingDetails" component={ArticleLookingDetails} />
        <Stack.Screen name="chatDetails" component={ChatDetails} />
        {user===null?<>
        <Stack.Screen name="login" component={Login} />
        </>:<></>
      }
    </Stack.Navigator>
  );
};

const ChatStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chat" component={Chat} />
      <Stack.Screen name="chatDetails" component={ChatDetails} />
    </Stack.Navigator>
  );
};
const SaveArticleStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="saveArticle" component={SaveArticle} />
      <Stack.Screen name="articleDetails" component={ArticleDetails} />
      <Stack.Screen name="chatDetails" component={ChatDetails} />
    </Stack.Navigator>
  );
}

const UserProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" component={UserProfile} />
      <Stack.Screen name="postArticle" component={PostArticle} />
      <Stack.Screen name="postArticleLooking" component={PostArticleLooking} />
      <Stack.Screen name="listAllArticle" component={AllArticle} />
      <Stack.Screen name="articleDetails" component={ArticleDetails} />
      <Stack.Screen name="articleLookingDetails" component={ArticleLookingDetails} />

      <Stack.Screen name="report" component={Report} />
      <Stack.Screen name="postHistory" component={PostHistory} />
    </Stack.Navigator>
  );
}


const listTab = ['home', 'login', 'register', 'profileMain', 'chat'];
// hi

const Tab = createBottomTabNavigator();
const TabNavigator = ()=> {
  const user = useContext(MyUserContext);
  const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'home'; 
    const hiddenRoutes = ['chatDetails', 'articleDetails', 'postArticle','articleLookingDetails']; 
    console.log(hiddenRoutes.includes(routeName));
    return !hiddenRoutes.includes(routeName);
  };

  const getScreenTitle = (route) => {
    let routeName = getFocusedRouteNameFromRoute(route);
    if (!routeName) {
      routeName= route.name;
    }
    const titles = {
      home: 'Màn Hình Chính',
      index: 'Màn Hình Chính',
      login: 'Đăng Nhập',
      register: 'Đăng Ký',
      profileMain: 'Tài Khoản',
      profile: 'Tài Khoản',
      chat: 'Nhắn Tin',
      chatMain: 'Nhắn Tin',
      saveArticleMain: 'Tin Đã Lưu',
      postArticle: 'Đăng Bài',
      postArticleLooking: 'Đăng Bài',
      listAllArticle: 'Kiểm Duyệt Bài',
      articleDetails: 'Chi Tiết Bài',
      articleLookingDetails: 'Chi Tiết Bài',
      report: 'Xem Báo Cáo',
      chatDetails: 'Chi Tiết Tin Nhắn',
      saveArticle: 'Tin Đã Lưu',
      postHistory: 'Lịch Sử Đăng Bài',
    };
    return titles[routeName]
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          display: getTabBarVisibility(route) ? 'flex' : 'none', 
        },
        headerTitleStyle: {
          color: 'white', 
        },
        headerTitle: getScreenTitle(route),
        headerTitleAlign: 'center', 
        headerStyle: {
          backgroundColor: 'blue',
        },
      })}
    >
      <Tab.Screen name="home" component={StackNavigator} options={{title: "Màn hình chính", tabBarIcon: () => <Icon source="home-account" size={20} />}} />
      {user===null?<>
        <Tab.Screen name="login" component={Login} options={{title: "Đăng nhập", tabBarIcon: () => <Icon source="account-check" size={20} />}} />
        <Tab.Screen name="register" component={Register} options={{title: "Đăng ký", tabBarIcon: () => <Icon source="account-plus" size={20} />}} />
      </>:<>
        <Tab.Screen name="profileMain" component={UserProfileStackNavigator} options={{title: "Tài khoản", tabBarIcon: () => <Icon source="account-check" size={20} />}} />
        <Tab.Screen name="chatMain" component={ChatStackNavigator} options={{title: "Nhắn Tin", tabBarIcon: () => <Icon source="account-check" size={20} />}} />
      </>}
      <Tab.Screen name="saveArticleMain" component={SaveArticleStackNavigator} options={{title: "Tin đã lưu", tabBarIcon: () => <Icon source="newspaper-check" size={20} />}} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducers, null);
  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <RefreshProvider>
            <TabNavigator />
          </RefreshProvider>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}

