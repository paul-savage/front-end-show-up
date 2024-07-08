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
import { getCustomerBookings, deleteBooking } from "../../utils/apicalls";
import { reformatTime } from "../../utils/utils";
import LoadingOverlay from "../LoadingOverlay";

const BookingsClient = () => {
  const { user, isLoggedIn, token } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCustomerBookings(token, user.user_id)
      .then((arr) => {
        setBookings(arr);
        setIsLoading(false);
      })
      .catch((err) => {
        setBookings([]);
        setError("Error fetching customer booking data");
        setIsLoading(false);
      });
  }, []);


  const handleCancellation = (id) => {
    deleteBooking(id).then(() => {
      setBookings(bookings.filter((booking) => {
        return booking.booking_id !== id
      }))
    })
    .catch((err) => {
      console.log(err)
    })
  }

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
                {booking.status === 'pending' ? <Text>Awaiting confirmation </Text> : <Text>Booking Confirmed!</Text>}
                <Button onPress={handleCancellation.bind(this, booking.booking_id)} title='Cancel Booking' />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default BookingsClient;

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
    color: "#eb1064",
    textAlign: "center",
  },
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  bookingContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    marginTop: 10,
    padding: 8,
  },
  bookingText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 6,
  },
});
