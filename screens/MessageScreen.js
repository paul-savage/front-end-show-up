import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { GlobalContext } from "../context/global-context";
import { conversations, me } from "../utils/apicalls";
import { useNavigation } from "@react-navigation/native";

function MessageScreen() {
  const { token } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigation();

  const fetchCurrentUser = useCallback(() => {
    me(token).then((user) => {
      console.log("Fetched current user:", user);
      setCurrentUser(user);
    });
  }, [token]);

  const fetchConversations = useCallback(() => {
    setRefreshing(true);
    conversations(token)
      .then((response) => {
        console.log("Fetched conversations:", response); 
        if (currentUser) {
          const filteredData = response.filter(
            (item) => item.username !== currentUser.username
          );
          setData(filteredData);
        } else {
          setData(response);
        }
      })
      .finally(() => setRefreshing(false));
  }, [token, currentUser]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [fetchConversations, currentUser]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ConversationScreen", {
          username: item.username,
          first_name: item.first_name,
          last_name: item.last_name,
        })
      }
    >
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.profile_img_url }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text
            style={styles.name}
          >{`${item.first_name} ${item.last_name}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.rootContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.username}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchConversations}
          />
        }
      />
    </View>
  );
}

export default MessageScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    height: 125,
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "darkslateblue",
  },
  headerTitle: {
    paddingLeft: 15,
    paddingTop: 65,
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
