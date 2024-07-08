import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GlobalContext } from "../context/global-context";
import { getConversation, sendMessage } from "../utils/apicalls";

function ConversationScreen({ route, navigation }) {
  const { token } = useContext(GlobalContext);
  const { username, first_name, last_name } = route.params;
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [recipientId, setRecipientId] = useState(null);

  const flatListRef = useRef(null);

  const fetchConversation = useCallback(() => {
    setRefreshing(true);
    getConversation(token, username)
      .then((conversation) => {
        setData((prevData) => {
          const newMessages = conversation.filter(
            (newMsg) =>
              !prevData.some(
                (prevMsg) => prevMsg.message_id === newMsg.message_id
              )
          );
          return [...prevData, ...newMessages];
        });
        if (conversation.length > 0) {
          const message = conversation[0];
          const recipientId =
            message.sender_username !== username
              ? message.sender_id
              : message.recipient_id;
          setRecipientId(recipientId);
        }
      })
      .finally(() => {
        setRefreshing(false);
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      });
  }, [token, username]);

  useEffect(() => {
    fetchConversation();
    const interval = setInterval(fetchConversation, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchConversation]);

  useEffect(() => {
    if (data.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [data]);

  const handleSendMessage = () => {
    if (recipientId) {
      sendMessage(token, recipientId, message)
        .then((newMessage) => {
          setData((prevData) => [...prevData, newMessage]);
          setMessage("");
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={
        item.sender_username === username
          ? styles.messageLeft
          : styles.messageRight
      }
    >
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageTime}>
        {new Date(item.created_at).toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.rootContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.message_id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchConversation}
          />
        }
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
    backgroundColor: "#fff",
    padding: 10,
  },
  messageLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    maxWidth: "75%",
  },
  messageRight: {
    alignSelf: "flex-end",
    backgroundColor: "#007aff",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    maxWidth: "75%",
  },
  messageText: {
    color: "#000",
    fontSize: 16,
  },
  messageTime: {
    color: "#999",
    fontSize: 12,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
