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
} from "react-native";
import { useState, useContext } from "react";
import { GlobalContext } from "../../context/global-context";
import { authenticateUser, me, registerUser } from "../../utils/apicalls";
import { GlobalStyles } from "../../constants/styles";

const UserCreateEntertainer = ({
  template,
  setTemplate,
  gotoLoggedIn,
  gotoLoggingIn,
}) => {
  const { setUser, setIsLoggedIn, setToken } = useContext(GlobalContext);

  const handleChangeEntertainer = (prop, value) => {
    if (prop === "price") {
      value = +value;
    }
    setTemplate((current) => {
      return { ...current, [prop]: value };
    });
  };

  const handleEntertainerCreation = () => {
    registerUser(template)
      .then((response) => {
        setUser(response);
        //console.log("Create entertainer log in Data----->>>>>", response);
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

  const handleCancelEntertainerCreation = () => {
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
              onChangeText={handleChangeEntertainer.bind(this, "username")}
            />
            <Text style={styles.label}>Enter password:</Text>
            <TextInput
              style={styles.input}
              value={template.password}
              autoCapitalize="none"
              autoCorrect={false}
              //secureTextEntry={true}
              onChangeText={handleChangeEntertainer.bind(this, "password")}
            />
            <Text style={styles.label}>Enter first name:</Text>
            <TextInput
              style={styles.input}
              value={template.first_name}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChangeEntertainer.bind(this, "first_name")}
            />
            <Text style={styles.label}>Enter last name:</Text>
            <TextInput
              style={styles.input}
              value={template.last_name}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChangeEntertainer.bind(this, "last_name")}
            />
            <Text style={styles.label}>Enter email address:</Text>
            <TextInput
              style={styles.input}
              value={template.email}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChangeEntertainer.bind(this, "email")}
            />
            <Text style={styles.label}>Enter category:</Text>
            <TextInput
              style={styles.input}
              value={template.category}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChangeEntertainer.bind(this, "category")}
            />
            <Text style={styles.label}>Enter location:</Text>
            <TextInput
              style={styles.input}
              value={template.location}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChangeEntertainer.bind(this, "location")}
            />
            <Text style={styles.label}>Enter entertainer name:</Text>
            <TextInput
              style={styles.input}
              value={template.entertainer_name}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChangeEntertainer.bind(
                this,
                "entertainer_name"
              )}
            />
            <Text style={styles.label}>Enter description:</Text>
            <TextInput
              style={[styles.input, styles.inputMultiLine]}
              value={template.description}
              autoCapitalize="none"
              autoCorrect={false}
              multiline={true}
              numberOfLines={3}
              onChangeText={handleChangeEntertainer.bind(this, "description")}
            />
            <Text style={styles.label}>Enter price:</Text>
            <TextInput
              style={styles.input}
              value={template.price}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              onChangeText={handleChangeEntertainer.bind(this, "price")}
            />
            <View style={styles.buttonWrapper}>
              <Button
                title="Create Account"
                onPress={handleEntertainerCreation}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title="Cancel"
                onPress={handleCancelEntertainerCreation}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserCreateEntertainer;

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
    color: "black",
    marginBottom: 4,
    textAlign: "center",
  },
  input: {
    backgroundColor: GlobalStyles.colors.primary100,
    color: GlobalStyles.colors.primary700,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
  },
  inputMultiLine: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
