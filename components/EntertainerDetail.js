import { View, Text, Button, StyleSheet } from "react-native";

function EntertainerDetails({ entertainer, setScreen }) {
  function backHandler() {
    setScreen(0);
  }

  return (
    <View style={styles.rootContainer}>
      <Text>
        These are the details for{" "}
        <Text style={styles.highlight}>{entertainer.entertainer_name}</Text>
      </Text>
      <Button title="Back to Listings" onPress={backHandler} />
    </View>
  );
}

export default EntertainerDetails;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  highlight: {
    fontWeight: "bold",
    color: "#eb1064",
  },
});
