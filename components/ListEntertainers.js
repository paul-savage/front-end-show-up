import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ListEntertainers = ({
  entertainers,
  searchParams,
  setSearchParams,
  setEntertainer,
  locations,
  categories,
  onShowDetails,
}) => {
  const [location, setLocation] = useState('All');
  const [category, setCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const currentCategory = searchParams.category;
    if (currentCategory) {
      setCategory(currentCategory);
    } else {
      setCategory(categories[0]);
    }
    const currentLocation = searchParams.location;
    if (currentLocation) {
      setLocation(currentLocation);
    } else {
      setLocation(locations[0]);
    }
  }, []);

  const handleShowDetails = (item) => {
    setEntertainer(item);
    onShowDetails();
  };

  const handleSearch = () => {
    const query = {};
    if (location !== locations[0]) {
      query.location = location;
    }
    if (category !== categories[0]) {
      query.category = category;
    }
    setSearchParams(query);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.rootContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.filterButtonText}>Search Entertainers</Text>
          </TouchableOpacity>

          {entertainers.length === 0 ? (
            <Text style={styles.labelNone}>No entertainers available</Text>
          ) : (
            entertainers.map((item) => (
              <View key={item.user_id} style={styles.card}>
                <Image style={styles.image} source={{ uri: item.profile_img_url }} />
                <Text style={styles.eName}>{item.entertainer_name}</Text>
                <Text style={styles.dName}>Location: {item.location}</Text>
                <Text style={styles.dName}>Category: {item.category}</Text>
                <View style={styles.buttonContainer}>
                  <Button title="Show details" onPress={() => handleShowDetails(item)} />
                </View>
              </View>
            ))
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.text}>Select location:</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.pickerItem}
                  itemStyle={{height:50}}
                  selectedValue={location}
                  onValueChange={(itemValue) => setLocation(itemValue)}
                >
                  {locations.map((location) => (
                    <Picker.Item key={location} label={location} value={location} />
                  ))}
                </Picker>
              </View>
              <Text style={styles.text}>Select category:</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.pickerItem}
                  itemStyle={{height:50}}
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                >
                  {categories.map((category) => (
                    <Picker.Item key={category} label={category} value={category} />
                  ))}
                </Picker>
              </View>
              <View style={styles.modalButtonContainer}>
                <Button title="Search" color="#3e04c3" onPress={handleSearch} />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListEntertainers;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  rootContainer: {
    padding: 16,
  },
  filterButton: {
    backgroundColor: 'darkslateblue',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  eName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
  },
  dName: {
    textAlign: 'center',
    color: '#555',
    marginVertical: 4,
  },
  labelNone: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 100,
    justifyContent: 'center',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 10,
  },
  pickerItem: {
    height: 50,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtonContainer: {
    marginTop: 20,
  },
});