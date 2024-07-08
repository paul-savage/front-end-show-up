import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { GlobalContext } from '../../context/global-context';
import { authenticateUser, me } from '../../utils/apicalls';

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
            setLoginName('');
            setPassword('');
            setUser(response);
            setIsLoggedIn(true);
            gotoLoggedIn();
          })
          .catch((err) => {
            setError('Invalid username or password');
            console.log(err);
          });
      })
      .catch((err) => {
        setError('Invalid username or password');
        console.log(err);
      });
  };

  const handleCreateCustomer = () => {
    setError(null);
    setTemplate({
      username: '',
      password: '',
      first_name: '',
      last_name: '',
      email: '',
      user_type: 'Client',
    });
    gotoCreateCustomer();
  };

  const handleCreateEntertainer = () => {
    setError(null);
    setTemplate({
      username: '',
      password: '',
      first_name: '',
      last_name: '',
      email: '',
      user_type: 'Entertainer',
      category: '',
      location: '',
      entertainer_name: '',
      description: '',
      price: 0,
    });
    gotoCreateEntertainer();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.rootContainer}>
          <Text style={styles.title}>Log In</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={loginName}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChangeLoginName}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
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
            <TouchableOpacity style={styles.button} onPress={handleLogIn}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <Text style={styles.bigOR}>OR</Text>
            <Text style={styles.title}>Register</Text>
            <TouchableOpacity style={styles.button} onPress={handleCreateCustomer}>
              <Text style={styles.buttonText}>Customer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={handleCreateEntertainer}>
              <Text style={styles.buttonText}>Entertainer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserLoggingIn;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: 'darkslateblue',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  button: {
    backgroundColor: 'darkslateblue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bigOR: {
    fontSize: 32,
    marginVertical: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    color: 'black',
  },
  errorContainer: {
    marginVertical: 12,
    backgroundColor: '#dd8888',
    borderRadius: 10,
  },
  errorText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    padding: 6,
  },
});