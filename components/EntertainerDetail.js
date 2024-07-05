import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";

const EntertainerDetail = ({ entertainer, setScreen }) => {
  useEffect(() => {}, []);

  const backHandler = () => {
    setScreen(0);
  };

  const bookingHandler = () => {
    setScreen(2)
  }

  return (
    <>
      <View style={styles.rootContainer}>
        <ScrollView>
          <View key={entertainer.user_id} style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: entertainer.profile_img_url }}
            />
            <Text style={styles.eName}>{entertainer.entertainer_name}</Text>
            <Text style={styles.dName}>Location: {entertainer.location}</Text>
            <Text style={styles.dName}>Category: {entertainer.category}</Text>
            <Text style={styles.dName}>Price: {entertainer.price}</Text>
            <Text style={styles.dName}>{entertainer.description}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Back to listings" onPress={backHandler} />
              <Button title="Book now!" onPress={bookingHandler} />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default EntertainerDetail;

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
