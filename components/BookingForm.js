import { View, Text, Button, StyleSheet, ScrollView } from "react-native";

const BookingForm = ({ entertainer, onShowEntertainers }) => {
  return (
    <>
      <View style={styles.rootContainer}>
        <Text>hello</Text>
        <View style={styles.buttonContainer}>
          <Button title="Back to listings" onPress={onShowEntertainers} />
        </View>
      </View>
    </>
  );
};

export default BookingForm;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 12,
  },
});
