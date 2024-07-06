import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../../context/global-context";
import { getBookings } from "../../utils/apicalls";
import { reformatTime } from "../../utils/utils";
import LoadingOverlay from "../LoadingOverlay";

function BookingsEntertainer() {
  const { user, isLoggedIn, token } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // for the moment we have to get all bookings and
    // filter out those that apply to the entertainer
    getBookings()
      .then((arr) => {
        const entertainerBookings = arr.filter(
          (booking) => booking.entertainer_id === user.user_id
        );
        //console.log("Entertainer----->>>>>", entertainerBookings);
        setBookings(entertainerBookings);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Error fetching entertainer booking data");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.rootContainer}>
        <Text>
          No bookings found for {user.first_name} {user.last_name}
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView>
        <View style={styles.rootContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.heading}>
              Found {bookings.length} bookings for {user.first_name}{" "}
              {user.last_name}
            </Text>

            {bookings.map((booking) => (
              <View key={booking.booking_id} style={styles.bookingContainer}>
                <Text style={styles.bookingText}>
                  Details: {booking.event_details}
                </Text>
                <Text style={styles.bookingText}>
                  Date: {reformatTime(booking.booking_date)}
                </Text>
                <Text style={styles.bookingText}>
                  Address: {booking.address}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default BookingsEntertainer;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#a04000",
    textAlign: "center",
  },
  inputContainer: {
    marginHorizontal: 4,
  },
  bookingContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    marginTop: 10,
    marginBottom: 0,
    padding: 8,
  },
  bookingText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 6,
  },
});
