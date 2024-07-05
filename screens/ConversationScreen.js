import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { GlobalContext } from '../context/global-context';
import { getConversation, sendMessage } from '../utils/apicalls';

function ConversationScreen({ route, navigation }) {
  const { token } = useContext(GlobalContext);
  const { username, first_name, last_name } = route.params;
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [recipientId, setRecipientId] = useState(null);

  const fetchConversation = useCallback(() => {
    setRefreshing(true);
    getConversation(token, username)
      .then(conversation => {
        setData(conversation);
        if (conversation.length > 0) {
          const message = conversation[0];
          const recipientId = message.sender_username !== username ? message.recipient_id : message.sender_id;
          setRecipientId(recipientId);
        }
      })
      .finally(() => setRefreshing(false));
  }, [token, username]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const handleSendMessage = () => {
    if (recipientId) {
      sendMessage(token, recipientId, message)
        .then((newMessage) => {
          setData((prevData) => [newMessage, ...prevData]);
          setMessage('');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.sender_username === username ? styles.messageLeft : styles.messageRight}>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.rootContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={data}
        keyExtractor={(item) => item.message_id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchConversation} />
        }
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </KeyboardAvoidingView>
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
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});