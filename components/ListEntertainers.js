import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";

const ListEntertainers = ({ items, searchParams, setSearchParams }) => {
  const [locations, setLocations] = useState([
    "All",
    "London",
    "Paris",
    "Madrid",
    "New York",
  ]);
  const [categories, setCategories] = useState(["All", "Juggler", "Violinist"]);
  const [location, setLocation] = useState("All");
  const [category, setCategory] = useState("All");
  const [date, setDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  useEffect(() => {}, []);

  const handleShowDetails = (item) => {
    setModalItem(item);
    setTimeout(() => {
      setModalVisible(true);
    }, 100);
  };

  if (items.length === 0) {
    return (
      <View style={styles.rootContainer}>
        <Text>No entertainers available</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.rootContainer}>
        <ScrollView>
          <View style={styles.outerPickerContainer}>
            <View>
              <Text style={styles.text}>Select location:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.pickerItem}
                  selectedValue={location}
                  onValueChange={(itemValue, itemIndex) => {
                    setLocation(itemValue);
                  }}
                >
                  {locations.map((location) => {
                    return (
                      <Picker.Item
                        key={location}
                        label={location}
                        value={location}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
            <View>
              <Text style={styles.text}>Select category:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.pickerItem}
                  selectedValue={category}
                  onValueChange={(itemValue, itemIndex) => {
                    setCategory(itemValue);
                  }}
                >
                  {categories.map((category) => {
                    return (
                      <Picker.Item
                        key={category}
                        label={category}
                        value={category}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Search" color="#3e04c3" onPress={() => {}} />
          </View>

          {items.map((item) => (
            <View key={item.user_id} style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: item.profile_img_url }}
              />
              <Text style={styles.eName}>{item.entertainer_name}</Text>
              <Text style={styles.dName}>Location: {item.location}</Text>
              <Text style={styles.dName}>Category: {item.category}</Text>
              <Text style={styles.dName}>Price: {item.price}</Text>
              <Text style={styles.dName}>{item.description}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Show details"
                  onPress={handleShowDetails.bind(this, item)}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.centeredView}>
        <Modal
          presentationStyle="fullScreen"
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
          {/* <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                style={styles.image}
                source={{ uri: modalItem.profile_img_url }}
              />
              <Text style={styles.eName}>{modalItem.entertainer_name}</Text>
              <Text style={styles.dName}>Location: {modalItem.location}</Text>
              <Text style={styles.dName}>Category: {modalItem.category}</Text>
              <Text style={styles.dName}>Price: {modalItem.price}</Text>
              <Text style={styles.dName}>{modalItem.description}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Dismiss"
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </View>
            </View>
          </View> */}
        </Modal>
      </View>
    </>
  );
};

export default ListEntertainers;

const styles = StyleSheet.create({
  rootContainer: {
    marginHorizontal: 16,
    marginTop: 60,
    marginBottom: 32,
  },
  outerPickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center,",
    //backgroundColor: "grey",
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: "lightgrey",
    borderRadius: 8,
    marginTop: 8,
  },
  pickerItem: {},
  radio: {
    marginVertical: 10,
  },
  text: {
    fontSize: 24,
    textAlign: "center",
  },
  eName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  dName: {
    textAlign: "center",
    marginTop: 6,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 350,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  ///////////////////////////////
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
