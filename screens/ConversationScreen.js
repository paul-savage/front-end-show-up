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
import { getConversation, me, sendMessage } from "../utils/apicalls";

function ConversationScreen({ route, navigation }) {
  const { token } = useContext(GlobalContext);
  const { username } = route.params;
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [recipientId, setRecipientId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const flatListRef = useRef(null);

  const fetchCurrentUser = useCallback(() => {
    me(token).then((user) => {
      console.log("Fetched current user:", user); // Debugging log
      setCurrentUser(user);
    });
  }, [token]);

  const fetchConversation = useCallback(() => {
    setRefreshing(true);
    getConversation(token, username)
      .then((conversation) => {
        console.log("Fetched conversation:", conversation);
        setData((prevData) => {
          const newMessages = conversation.filter(
            (newMsg) =>
              !prevData.some(
                (prevMsg) => prevMsg.message_id === newMsg.message_id
              )
          );
          const mergedData = [...prevData, ...newMessages];
          return mergedData;
        });
        if (conversation.length > 0) {
          const message = conversation[0];
          const recipientId =
            message.sender_username !== currentUser.username
              ? message.sender_id
              : message.recipient_id;
          setRecipientId(recipientId);
        }
      })
      .finally(() => {
        setRefreshing(false);
        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 500);
      });
  }, [token, username, currentUser]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchConversation();
      const interval = setInterval(fetchConversation, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [fetchConversation, currentUser]);

  useEffect(() => {
    if (data.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 500);
    }
  }, [data]);

  const handleSendMessage = () => {
    if (recipientId) {
      const newMessage = {
        message_id: Date.now(),
        sender_username: currentUser.username,
        message,
        created_at: new Date(),
      };
      console.log("Sending message:", newMessage);
      setData((prevData) => [...prevData, newMessage]);
      setMessage("");
      sendMessage(token, recipientId, message)
        .then((sentMessage) => {
          console.log("Message sent:", sentMessage);
          setData((prevData) => prevData.map(msg => msg.message_id === newMessage.message_id ? sentMessage : msg));
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }, 500);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={
        item.sender_username === currentUser.username
          ? styles.messageRight
          : styles.messageLeft
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
    backgroundColor: "#A492FE",
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