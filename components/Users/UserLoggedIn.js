import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { useContext } from "react";
import { GlobalContext } from "../../context/global-context";
import { GlobalStyles } from "../../constants/styles";

const UserLoggedIn = ({ gotoLoggingIn }) => {
  const { user, setUser, setToken, setIsLoggedIn } = useContext(GlobalContext);

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setUser({});
    setToken("");
    gotoLoggingIn();
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Logged in as: {user.first_name} {user.last_name}
        </Text>
        <View style={styles.buttonWrapper}>
          <Button title="Log Out" onPress={handleLogOut} />
        </View>
      </View>
    </View>
  );
};

export default UserLoggedIn;

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
  buttonWrapper: {
    marginVertical: 8,
  },
});
