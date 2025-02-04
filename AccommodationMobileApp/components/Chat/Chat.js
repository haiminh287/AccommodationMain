import { Text, View } from "react-native";
import { db } from "../../configs/Firebase";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/UserContexts";
import { collection, query, where, getDocs, getDoc, doc, onSnapshot } from "firebase/firestore";
import ChatList from "./ChatList";
import { ActivityIndicator } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";

const Chat = () => {
  const userContext = useContext(MyUserContext);
  const [user, setUser] = useState(userContext);
  const [loading, setLoading] = useState(true);
  const [usersChatWithMe, setUsersChatWithMe] = useState([]);
  let userId = '';
  if (userContext){
     userId = userContext.id;
  }

  const getListUsersChatWithMe = (userId) => {
    setLoading(true);
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", userId)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const userIdsSet = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const otherUserId = data.participants.find((id) => id !== userId);
        if (otherUserId) {
          userIdsSet.add(otherUserId);
        }
      });

      console.log("UserIds", userIdsSet);
      const userIds = Array.from(userIdsSet);
      const users = [];
      for (const id of userIds) {
        const userDoc = await getDoc(doc(db, "users", id.toString()));
        if (userDoc.exists()) {
          users.push({ id, ...userDoc.data() });
        }
      }

      console.log("Users", users);

      setUsersChatWithMe(users);
      setLoading(false); 
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = getListUsersChatWithMe(userId);
    return () => unsubscribe();
  }, [userId]);

  return (
    <View>
      {loading ? <ActivityIndicator /> : <ChatList usersChatWithMe={usersChatWithMe} />}
    </View>
  );
};

export default Chat;