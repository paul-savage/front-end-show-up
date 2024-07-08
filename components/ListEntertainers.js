import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  Animated,
  Button,
  FlatList,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');
const cardWidth = (width - 70) / 2; // 16px padding on each side and 16px space between cards

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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const anims = entertainers.map(() => useRef(new Animated.Value(0)).current);

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

  useEffect(() => {
    anims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, [anims]);

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
    closeModal();
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.user_id}
      style={{ opacity: anims[index] }}
      onPress={() => handleShowDetails(item)}
    >
      <Animated.View style={[styles.card, { opacity: anims[index] }]}>
        <Text style={styles.eName}>{item.entertainer_name}</Text>
        <Image style={styles.image} source={{ uri: item.profile_img_url }} />
        <View style={styles.cardContent}>
          <Text style={styles.dName}>{item.category}</Text>
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.rootContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={openModal}>
          <Text style={styles.filterButtonText}>Search Entertainers</Text>
        </TouchableOpacity>

        {entertainers.length === 0 ? (
          <Text style={styles.labelNone}>No entertainers available</Text>
        ) : (
          <FlatList
            data={entertainers}
            renderItem={renderItem}
            keyExtractor={(item) => item.user_id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.contentContainer}
          />
        )}

        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.text}>Select location:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.pickerItem}
                itemStyle={{ height: 50 }}
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
                itemStyle={{ height: 50 }}
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
          </Animated.View>
        </Modal>
      </View>
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
    flex: 1,
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
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  contentContainer: {
    paddingHorizontal: 8,
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
    alignItems: 'center',
    width: cardWidth,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  eName: {
    fontSize: 18,
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
  labelNone: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
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
    marginTop: 'auto',
    marginBottom: 0,
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