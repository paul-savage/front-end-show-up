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
import { getLocations, getCategories } from "../utils/apicalls";

const ListEntertainers = ({
  entertainers,
  searchParams,
  setSearchParams,
  setScreen,
  setEntertainer,
}) => {
  const [locations, setLocations] = useState([
    "All",
    "London",
    "Oxford",
    "Paris",
    "Madrid",
    "New York",
  ]);
  const [categories, setCategories] = useState(["All", "Juggler", "Violinist"]);
  const [location, setLocation] = useState("All");
  const [category, setCategory] = useState("All");
  const [date, setDate] = useState(null);

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
    setScreen(1);
  };

  const handleSearch = (item) => {
    const query = {};
    if (location !== locations[0]) {
      query.location = location;
    }
    if (category !== categories[0]) {
      query.category = category;
    }
    setSearchParams(query);
  };

  if (entertainers.length === 0) {
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
            <Button title="Search" color="#3e04c3" onPress={handleSearch} />
          </View>

          {entertainers.map((item) => (
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
});
