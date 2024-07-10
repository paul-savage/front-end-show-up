import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useState, useContext } from "react";
import { GlobalContext } from "../../context/global-context";
import { authenticateUser, registerUser } from "../../utils/apicalls";
import { GlobalStyles } from "../../constants/styles";

const UserCreateCustomer = ({
  template,
  setTemplate,
  gotoLoggedIn,
  gotoLoggingIn,
}) => {
  const { setUser, setIsLoggedIn, setToken } = useContext(GlobalContext);

  const handleChangeClient = (prop, value) => {
    setTemplate((current) => {
      return { ...current, [prop]: value };
    });
  };

  const handleClientCreation = () => {
    registerUser(template)
      .then((response) => {
        setUser(response);
        //console.log("Create customer log in Data----->>>>>", response);
      })
      .then(() => {
        authenticateUser(template.username, template.password)
          .then((res) => {
            setToken(res.token);
            setIsLoggedIn(true);
            gotoLoggedIn();
          })
          .catch((err) => {
            Alert.alert("Input Error", "Invalid, or missing entries");
            console.log(err);
          });
      })
      .catch((err) => {
        Alert.alert("Input Error", "Invalid, or missing entries");
        console.log(err);
      });
  };

  const handleCancelClientCreation = () => {
    gotoLoggingIn();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View style={styles.rootContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter user name:</Text>
            <TextInput
              style={styles.input}
              value={template.username}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChangeClient.bind(this, "username")}
            />
            <Text style={styles.label}>Enter password:</Text>
            <TextInput
              style={styles.input}
              value={template.password}
              autoCapitalize="none"
              autoCorrect={false}
              //secureTextEntry={true}
              onChangeText={handleChangeClient.bind(this, "password")}
            />
            <Text style={styles.label}>Enter first name:</Text>
            <TextInput
              style={styles.input}
              value={template.first_name}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChangeClient.bind(this, "first_name")}
            />
            <Text style={styles.label}>Enter last name:</Text>
            <TextInput
              style={styles.input}
              value={template.last_name}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChangeClient.bind(this, "last_name")}
            />
            <Text style={styles.label}>Enter email address:</Text>
            <TextInput
              style={styles.input}
              value={template.email}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChangeClient.bind(this, "email")}
            />
           <View style={styles.buttonContainer}>
              <TouchableOpacity
              style={styles.button}
                onPress={handleClientCreation}
               >
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity> 
            <TouchableOpacity
              style={styles.button}
                onPress={handleClientCreation}
               >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity> 
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserCreateCustomer;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
    width: "80%",
  },
  buttonWrapper: {
    marginVertical: 8,
  },
  label: {
    fontSize: 18,
    color: GlobalStyles.colors.primary100,
    color: "#4D4C57",
    marginBottom: 4,
    textAlign: "left",
  },
  input: {
    backgroundColor: "#BAB8F3",
    color: GlobalStyles.colors.primary700,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "100%",
  },
  button: {
    backgroundColor: "darkslateblue",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
