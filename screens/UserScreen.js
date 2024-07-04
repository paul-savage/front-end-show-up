import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useContext } from "react";
import { GlobalContext } from "../context/global-context";
import { useEffect, useState } from "react";
import { authenticateUser, me, registerUser } from "../utils/apicalls";
import LoadingOverlay from "../components/LoadingOverlay";
import { GlobalStyles } from "../constants/styles";

function UserScreen({ navigation }) {
  const { user, setUser, isLoggedIn, setIsLoggedIn, token, setToken } =
    useContext(GlobalContext);

  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidUser, setIsInvalidUser] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isFetchUsersError, setIsFetchUsersError] = useState(false);
  // choice of screen:
  // 0 - logging in
  // 1 = logged in
  const [screen, setScreen] = useState(0);
  const [template, setTemplate] = useState({});

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setUser({});
    setScreen(0);
    setToken("");
  };

  const handleChangeLoginName = (value) => {
    setLoginName(value);
    setIsInvalidUser(false);
  };

  const handleChangePassword = (value) => {
    setPassword(value);
    setIsInvalidPassword(false);
  };

  const handleLogIn = () => {
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
            setScreen(1);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateCustomer = () => {
    setTemplate({
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      email: "",
      user_type: "Client",
    });
    setScreen(2);
  };

  const handleCreateEntertainer = () => {
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
    setScreen(3);
  };

  const handleChangeClient = (prop, value) => {
    setTemplate((current) => {
      return { ...current, [prop]: value };
    });
  };

  const handleChangeEntertainer = (prop, value) => {
    if (prop === "price") {
      value = +value;
    }
    setTemplate((current) => {
      return { ...current, [prop]: value };
    });
  };

  const handleClientCreation = () => {
    registerUser(template)
      .then((response) => {
        console.log(response);
      })
      .then(() => {
        authenticateUser(template.username, template.password)
          .then((res) => {
            setToken(res.token);
            setUser(template);
            setIsLoggedIn(true);
            setScreen(1);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancelClientCreation = () => {
    setScreen(0);
  };

  const handleEntertainerCreation = () => {
    registerUser(template)
      .then((response) => {
        console.log(response);
      })
      .then(() => {
        authenticateUser(template.username, template.password)
          .then((res) => {
            setToken(res.token);
            setUser(template);
            setIsLoggedIn(true);
            setScreen(1);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancelEntertainerCreation = () => {
    setScreen(0);
  };

  //   if (isFetchUsersError) {
  //     return (
  //       <View style={styles.rootContainer}>
  //         <Text>Error fetching user names</Text>
  //       </View>
  //     );
  //   }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (screen === 0) {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter user name:</Text>
          <TextInput
            style={styles.input}
            value={loginName}
            autoCapitalize="none"
            autoCorrect="false"
            onChangeText={handleChangeLoginName}
          />
          {isInvalidUser ? (
            <Text style={styles.invalidInput}>Invalid user name</Text>
          ) : null}
          <Text style={styles.label}>Enter password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            autoCapitalize="none"
            autoCorrect="false"
            secureTextEntry="true"
            onChangeText={handleChangePassword}
          />
          {isInvalidPassword ? (
            <Text style={styles.invalidInput}>Invalid password</Text>
          ) : null}
          <Button title="Log In" onPress={handleLogIn} />
          <Text style={styles.bigOR}>OR</Text>
          <Text style={styles.label}>Create a profile</Text>
          <View style={styles.buttonContainer}>
            <Button title="Customer" onPress={handleCreateCustomer} />
            <Button title="Entertainer" onPress={handleCreateEntertainer} />
          </View>
        </View>
      </View>
    );
  }

  if (screen === 1) {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Logged in as: {user.first_name} {user.last_name}
          </Text>
          <Button title="Log Out" onPress={handleLogOut} />
        </View>
      </View>
    );
  }

  if (screen === 2) {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter user name:</Text>
          <TextInput
            style={styles.input}
            value={template.username}
            autoCapitalize="none"
            autoCorrect="false"
            onChangeText={handleChangeClient.bind(this, "username")}
          />
          <Text style={styles.label}>Enter password:</Text>
          <TextInput
            style={styles.input}
            value={template.password}
            autoCapitalize="none"
            autoCorrect="false"
            //secureTextEntry="true"
            onChangeText={handleChangeClient.bind(this, "password")}
          />
          <Text style={styles.label}>Enter first name:</Text>
          <TextInput
            style={styles.input}
            value={template.first_name}
            autoCapitalize="none"
            autoCorrect="false"
            onChangeText={handleChangeClient.bind(this, "first_name")}
          />
          <Text style={styles.label}>Enter last name:</Text>
          <TextInput
            style={styles.input}
            value={template.last_name}
            autoCapitalize="none"
            autoCorrect="false"
            onChangeText={handleChangeClient.bind(this, "last_name")}
          />
          <Text style={styles.label}>Enter email address:</Text>
          <TextInput
            style={styles.input}
            value={template.email}
            autoCapitalize="none"
            autoCorrect="false"
            onChangeText={handleChangeClient.bind(this, "email")}
          />
          <Button title="Create Account" onPress={handleClientCreation} />
          <Button title="Cancel" onPress={handleCancelClientCreation} />
        </View>
      </View>
    );
  }

  if (screen === 3) {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter user name:</Text>
          <TextInput
            style={styles.input}
            value={template.username}
            autoCapitalize="none"
            autoCorrect="false"
            onChangeText={handleChangeEntertainer.bind(this, "username")}
          />
          <Text style={styles.label}>Enter password:</Text>
          <TextInput
            style={styles.input}
            value={template.password}
            autoCapitalize="none"
            autoCorrect="false"
            //secureTextEntry="true"
            onChangeText={handleChangeEntertainer.bind(this, "password")}
          />
          <Text style={styles.label}>Enter first name:</Text>
          <TextInput
            style={styles.input}
            value={template.first_name}
            autoCapitalize="none"
            autoCorrect="false"
            onChangeText={handleChangeEntertainer.bind(this, "first_name")}
          />
          <Text style={styles.label}>Enter last name:</Text>
          <TextInput
            style={styles.input}
            value={template.last_name}
            autoCapitalize="none"
            autoCorrect="false"
            onChangeText={handleChangeEntertainer.bind(this, "last_name")}
          />
          <Text style={styles.label}>Enter email address:</Text>
          <TextInput
            style={styles.input}
            value={template.email}
            autoCapitalize="none"
            autoCorrect="false"
            onChangeText={handleChangeEntertainer.bind(this, "email")}
          />
          <Text style={styles.label}>Enter category:</Text>
          <TextInput
            style={styles.input}
            value={template.category}
            autoCapitalize="none"
            autoCorrect="false"
            onChangeText={handleChangeEntertainer.bind(this, "category")}
          />
          <Text style={styles.label}>Enter location:</Text>
          <TextInput
            style={styles.input}
            value={template.location}
            autoCapitalize="none"
            autoCorrect="false"
            onChangeText={handleChangeEntertainer.bind(this, "location")}
          />
          <Text style={styles.label}>Enter entertainer name:</Text>
          <TextInput
            style={styles.input}
            value={template.entertainer_name}
            autoCapitalize="none"
            autoCorrect="false"
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
            autoCorrect="false"
            multiline={true}
            numberOfLines={3}
            onChangeText={handleChangeEntertainer.bind(this, "description")}
          />
          <Text style={styles.label}>Enter price:</Text>
          <TextInput
            style={styles.input}
            value={template.price}
            autoCapitalize="none"
            autoCorrect="false"
            keyboardType="number-pad"
            onChangeText={handleChangeEntertainer.bind(this, "price")}
          />
          <Button title="Create Account" onPress={handleEntertainerCreation} />
          <Button title="Cancel" onPress={handleCancelEntertainerCreation} />
        </View>
      </View>
    );
  }
}

export default UserScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
    width: "80%",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-around",
  },
  label: {
    fontSize: 22,
    //color: GlobalStyles.colors.primary100,
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
  invalidLabel: {
    color: GlobalStyles.colors.error500,
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.error50,
  },
  bigOR: {
    fontSize: 32,
    marginVertical: 24,
    textAlign: "center",
  },
});
