import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState, useContext } from "react";
import { GlobalContext } from "../../context/global-context";
import { GlobalStyles } from "../../constants/styles";
import { authenticateUser, me } from "../../utils/apicalls";

const UserLoggingIn = ({
  loginName,
  setLoginName,
  password,
  setPassword,
  setTemplate,
  gotoLoggedIn,
  gotoCreateCustomer,
  gotoCreateEntertainer,
}) => {
  const { setUser, setIsLoggedIn, setToken } = useContext(GlobalContext);

  const [error, setError] = useState(null);

  const handleChangeLoginName = (value) => {
    setError(null);
    setLoginName(value);
  };

  const handleChangePassword = (value) => {
    setError(null);
    setPassword(value);
  };

  const handleLogIn = () => {
    setError(null);
    authenticateUser(loginName, password)
      .then((res) => {
        setToken(res.token);
        return res.token;
      })
      .then((token) => {
        me(token)
          .then((response) => {
            setLoginName("");
            setPassword("");
            setUser(response);
            setIsLoggedIn(true);
            //console.log("Log in Data----->>>>>", response);
            gotoLoggedIn();
          })
          .catch((err) => {
            setError("Invalid username or password");
            console.log(err);
          });
      })
      .catch((err) => {
        setError("Invalid username or password");
        console.log(err);
      });
  };

  const handleCreateCustomer = () => {
    setError(null);
    setTemplate({
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      email: "",
      user_type: "Client",
    });
    gotoCreateCustomer();
  };

  const handleCreateEntertainer = () => {
    setError(null);
    setTemplate({
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      email: "",
      user_type: "Entertainer",
      category: "",
      location: "",
      entertainer_name: "",
      description: "",
      price: 0,
    });
    gotoCreateEntertainer();
  };

  return (
    <ScrollView>
      <View style={styles.rootContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter user name:</Text>
          <TextInput
            style={styles.input}
            value={loginName}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={handleChangeLoginName}
          />
          <Text style={styles.label}>Enter password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={handleChangePassword}
          />
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <View style={styles.buttonWrapper}>
            <Button title="Log In" onPress={handleLogIn} />
          </View>
          <Text style={styles.bigOR}>OR</Text>
          <Text style={styles.label}>Create a profile</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}></View>
            <Button title="Customer" onPress={handleCreateCustomer} />
            <Button title="Entertainer" onPress={handleCreateEntertainer} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserLoggingIn;

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
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-evenly",
  },
  buttonWrapper: {
    marginVertical: 8,
  },
  bigOR: {
    fontSize: 32,
    marginVertical: 24,
    textAlign: "center",
  },
  errorContainer: {
    marginVertical: 12,
    backgroundColor: "#dd8888",
    borderRadius: 10,
  },
  errorText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
    padding: 6,
  },
});
