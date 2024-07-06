import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../context/global-context";
import BookingsClient from "../components/Bookings/BookingsClient";
import BookingsEntertainer from "../components/Bookings/BookingsEntertainer";

function BookingsScreen() {
  const { user, isLoggedIn } = useContext(GlobalContext);

  const BS_NOT_LOGGED_IN = 0;
  const BS_LOGGED_IN_AS_CLIENT = 1;
  const BS_LOGGED_IN_AS_ENTERTAINER = 2;
  const BS_ERROR = 3;
  const [bookingsState, setBookingsState] = useState(BS_NOT_LOGGED_IN);

  if (!isLoggedIn) {
    if (bookingsState !== BS_NOT_LOGGED_IN) {
      setBookingsState(BS_NOT_LOGGED_IN);
    }
    return (
      <View style={styles.rootContainer}>
        <Text>
          Please <Text style={styles.highlight}>Log in</Text> to access
          bookings!
        </Text>
      </View>
    );
  }

  if (bookingsState === BS_NOT_LOGGED_IN) {
    if (user.user_type === "Client") {
      setBookingsState(BS_LOGGED_IN_AS_CLIENT);
    } else if (user.user_type === "Entertainer") {
      setBookingsState(BS_LOGGED_IN_AS_ENTERTAINER);
    } else {
      setBookingsState(BS_ERROR);
    }
    return;
  }

  if (bookingsState === BS_LOGGED_IN_AS_CLIENT) {
    return <BookingsClient />;
  }

  if (bookingsState === BS_LOGGED_IN_AS_ENTERTAINER) {
    return <BookingsEntertainer />;
  }

  return (
    <View style={styles.rootContainer}>
      <Text>
        Error:{" "}
        <Text style={styles.highlight}>'user_type' = '{user.user_type}'</Text>{" "}
        unknown!
      </Text>
    </View>
  );
}

export default BookingsScreen;

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
