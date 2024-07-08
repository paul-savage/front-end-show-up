import React, { useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { GlobalContext } from '../context/global-context';

const EntertainerDetail = ({ entertainer, onShowEntertainers, onBookingForm }) => {
  const { isLoggedIn } = useContext(GlobalContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onShowEntertainers}>
          <Text style={styles.backButton}>&lt; Entertainers</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.rootContainer, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View key={entertainer.user_id} style={styles.card}>
            <Text style={styles.eName}>{entertainer.entertainer_name}</Text>
            <Image
              style={styles.image}
              source={{ uri: entertainer.profile_img_url }}
            />
            <View style={styles.cardContent}>
              <Text style={styles.dName}>{entertainer.category}</Text>
              <Text style={styles.location}>{entertainer.location}</Text>
            </View>
            <Text style={styles.dName}>Price: {entertainer.price}</Text>
            <Text style={styles.description}>{entertainer.description}</Text>
            <View style={styles.buttonContainer}>
              {isLoggedIn ? (
                <TouchableOpacity style={styles.button} onPress={onBookingForm}>
                  <Text style={styles.buttonText}>Book now!</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.button, styles.inactiveButton]} disabled>
                  <Text style={styles.buttonText}>Log in to book</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default EntertainerDetail;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navBar: {
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    fontSize: 16,
    color: 'darkslateblue',
  },
  rootContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  eName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  dName: {
    textAlign: 'left',
    color: '#555',
    marginVertical: 4,
    flex: 1,
  },
  location: {
    textAlign: 'right',
    color: '#555',
    marginVertical: 4,
    flex: 1,
  },
  description: {
    textAlign: 'center',
    marginVertical: 8,
  },
  buttonContainer: {
    marginTop: 16,
    width: '100%',
  },
  button: {
    backgroundColor: 'darkslateblue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  inactiveButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});