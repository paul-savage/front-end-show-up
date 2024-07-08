import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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

  const handleEditProfile = () => {
    // Handle edit profile logic here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.rootContainer}>
          <View style={styles.card}>
            <Image
              style={styles.avatar}
              source={{ uri: user.profile_img_url }}
            />
            <Text style={styles.eName}>{user.entertainer_name}</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.label}>Username: {user.username}</Text>
              <Text style={styles.label}>Name: {user.first_name} {user.last_name}</Text>
              <Text style={styles.label}>Email: {user.email}</Text>
              <Text style={styles.label}>User Type: {user.user_type}</Text>
              {user.user_type === 'Entertainer' && (
                <>
                  <Text style={styles.label}>Category: {user.category}</Text>
                  <Text style={styles.label}>Location: {user.location}</Text>
                  <Text style={styles.label}>Description: {user.description}</Text>
                  <Text style={styles.label}>Price: ${user.price}</Text>
                </>
              )}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogOut}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserLoggedIn;

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
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  eName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  profileInfo: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
    textAlign: 'left',
    width: '100%',
  },
  button: {
    backgroundColor: 'darkslateblue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
  },
});