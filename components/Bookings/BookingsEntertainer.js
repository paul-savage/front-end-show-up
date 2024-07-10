import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../../context/global-context";
import {
  getEntertainerBookings,
  deleteBooking,
  confirmBooking,
} from "../../utils/apicalls";
import { reformatTime } from "../../utils/utils";
import LoadingOverlay from "../LoadingOverlay";

const BookingsEntertainer = () => {
  const { user, isLoggedIn, token } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEntertainerBookings(token, user.user_id)
      .then((arr) => {
        setBookings(sortBookings(arr));
        setIsLoading(false);
      })
      .catch((err) => {
        setBookings([]);
        setError("Error fetching entertainer booking data");
        setIsLoading(false);
      });
  }, []);

  const handleCancellation = (id) => {
    deleteBooking(id)
      .then(() => {
        setBookings(
          bookings.filter((booking) => {
            return booking.booking_id !== id;
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const convertDateToTimestamp = (event_date) => {
    return new Date(event_date).getTime();
  };

  const sortBookings = (bookings) => {
    const bookingsCopy = [...bookings];
    return bookingsCopy.sort((a, b) => {
      return convertDateToTimestamp(a.event_date) >
        convertDateToTimestamp(b.event_date)
        ? 1
        : -1;
    });
  };

  const handleConfirmation = (id) => {
    confirmBooking(id)
      .then(() => {
        setBookings(sortBookings(bookings));
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
                  Date: {booking.event_date}
                </Text>
                <Text style={styles.bookingText}>
                  Address: {booking.address}
                </Text>
                {booking.status === 'pending' ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleConfirmation.bind(this, booking.booking_id)}
                  >
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.confirmText}>Booking Confirmed!</Text>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCancellation.bind(this, booking.booking_id)}
                >
                  <Text style={styles.buttonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

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
    borderWidth: 10,
    borderColor: "lightgrey",
    marginTop: 15,
    marginBottom: 0,
    padding: 8,
  },
  bookingText: {
    fontSize: 16,
    textAlign: "left",
    marginVertical: 6,
  },
  button: {
    backgroundColor: "#433a83",
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  confirmText: {
    color: "red",
  }
});
