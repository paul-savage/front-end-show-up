import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, Image, RefreshControl } from 'react-native';
import { GlobalContext } from '../context/global-context';
import { conversations } from '../utils/apicalls';

function MessageScreen() {
  const { token } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConversations = useCallback(() => {
    setRefreshing(true);
    conversations(token)
      .then(setData)
      .finally(() => setRefreshing(false));
  }, [token]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.profile_img_url }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{`${item.first_name} ${item.last_name}`}</Text>
      </View>
    </View>
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
          <RefreshControl refreshing={refreshing} onRefresh={fetchConversations} />
        }
      />
    </View>
  );
}

export default MessageScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    height: 125,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'yellow',
  },
  headerTitle: {
    paddingLeft: 15,
    paddingTop: 65,
    fontSize: 30,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});