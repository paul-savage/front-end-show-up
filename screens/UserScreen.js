import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import UserLoggingIn from "../components/Users/UserLoggingIn";
import UserLoggedIn from "../components/Users/UserLoggedIn";
import UserCreateCustomer from "../components/Users/UserCreateCustomer";
import UserCreateEntertainer from "../components/Users/UserCreateEntertainer";
import LoadingOverlay from "../components/LoadingOverlay";
import { getCategories, getLocations } from "../utils/apicalls";

function UserScreen() {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [template, setTemplate] = useState({});
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const US_LOGGING_IN = 0;
  const US_LOGGED_IN = 1;
  const US_CREATE_CUSTOMER = 2;
  const US_CREATE_ENTERTAINER = 3;
  const [userState, setUserState] = useState(US_LOGGING_IN);

  useEffect(() => {
    Promise.all([getLocations(), getCategories()])
      .then((arr) => {
        setLocations(arr[0]);
        setCategories(arr[1]);
        setIsLoading(false);
      })
      .catch((err) => {
        Alert.alert("Error fetching locations/categories");
        setIsLoading(false);
      });
  }, []);

  function updateUserState(value) {
    setUserState(value);
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  switch (userState) {
    case US_LOGGING_IN:
      return (
        <UserLoggingIn
          locations={locations}
          categories={categories}
          loginName={loginName}
          setLoginName={setLoginName}
          password={password}
          setPassword={setPassword}
          setTemplate={setTemplate}
          gotoLoggedIn={updateUserState.bind(this, US_LOGGED_IN)}
          gotoCreateCustomer={updateUserState.bind(this, US_CREATE_CUSTOMER)}
          gotoCreateEntertainer={updateUserState.bind(
            this,
            US_CREATE_ENTERTAINER
          )}
        />
      );
    case US_LOGGED_IN:
      return (
        <UserLoggedIn
          locations={locations}
          categories={categories}
          gotoLoggingIn={updateUserState.bind(this, US_LOGGING_IN)}
        />
      );
    case US_CREATE_CUSTOMER:
      return (
        <UserCreateCustomer
          template={template}
          setTemplate={setTemplate}
          gotoLoggedIn={updateUserState.bind(this, US_LOGGED_IN)}
          gotoLoggingIn={updateUserState.bind(this, US_LOGGING_IN)}
        />
      );
    case US_CREATE_ENTERTAINER:
      return (
        <UserCreateEntertainer
          locations={locations}
          categories={categories}
          template={template}
          setTemplate={setTemplate}
          gotoLoggedIn={updateUserState.bind(this, US_LOGGED_IN)}
          gotoLoggingIn={updateUserState.bind(this, US_LOGGING_IN)}
        />
      );
    default:
      return (
        <View style={styles.rootContainer}>
          <Text>
            Error:{" "}
            <Text style={styles.highlight}>'userState' = '{userState}'</Text>{" "}
            unknown!
          </Text>
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
    marginTop: 100,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  highlight: {
    fontWeight: "bold",
    color: "#eb1064",
  },
});
