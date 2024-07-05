import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native';
import { GlobalContext } from '../context/global-context';
import { getConversation } from '../utils/apicalls';

function ConversationScreen({ route }) {
  const { token } = useContext(GlobalContext);
  const { username } = route.params;
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConversation = useCallback(() => {
    setRefreshing(true);
    getConversation(token, username)
      .then(setData)
      .finally(() => setRefreshing(false));
  }, [token, username]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const renderItem = ({ item }) => (
    <View style={item.sender_username === username ? styles.messageLeft : styles.messageRight}>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.rootContainer}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.message_id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchConversation} />
        }
        inverted
      />
    </View>
  );
}

export default ConversationScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  messageLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    maxWidth: '75%',
  },
  messageRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#007aff',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    maxWidth: '75%',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
});