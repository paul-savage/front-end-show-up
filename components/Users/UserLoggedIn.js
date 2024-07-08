import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { GlobalContext } from '../../context/global-context';

const UserLoggedIn = ({ gotoLoggingIn }) => {
  const { user, setUser, setToken, setIsLoggedIn } = useContext(GlobalContext);

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setUser({});
    setToken('');
    gotoLoggingIn();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.rootContainer}>
        <Text style={styles.label}>
          Logged in as: {user.first_name} {user.last_name}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleLogOut}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserLoggedIn;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  rootContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: 'black',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'darkslateblue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});