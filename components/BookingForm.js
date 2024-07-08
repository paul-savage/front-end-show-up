import { useEffect, useState,useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Platform, 
  TouchableWithoutFeedback
} from "react-native";
import { Calendar } from "react-native-calendars";
import { GlobalStyles } from "../constants/styles";
import { getAvailability, postBooking, postAvailability } from "../utils/booking-form-api-call";
import moment from "moment";
import { GlobalContext } from "../context/global-context";

const BookingForm = ({ entertainer, onShowEntertainers }) => {
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState({});
  const firstDayOfCurrentMonth = moment().format("YYYY-MM-DD");
  const {user, token} = useContext(GlobalContext)


  useEffect(() => {
    getAvailability(entertainer.user_id)
      .then((body) => {
        setUnavailableDates(body.data.availability);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [entertainer]);

  const markedDates = {};

  unavailableDates.forEach((date) => {
    if (date.available === false) {
      const splitDate = date.date.split("T")[0];
      markedDates[splitDate] = { disabled: true, disableTouchEvent: true };
    }
  });

  const [bookingTemplate, setBookingTemplate] = useState({
    user_id: user.user_id,
    entertainer_id: entertainer.user_id,
    booking_date: new Date(),
    event_date: "",
    event_details: "",
    address: "",
  });

 

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setBookingTemplate((current) => {
      return { ...current, event_date: day.dateString };
    });
  };

  markedDates[selectedDate] = {
    selected: true,
    selectedColor: "blue",
  };

  const handleChange = (prop, value) => {
    console.log({entertainer_id: bookingTemplate})
    setBookingTemplate((current) => {
      return { ...current, [prop]: value };
    });
  };

  const handleConfirmBooking = () => {
    const availabilityObject = {
      entertainer_id: entertainer.entertainer_id,
      date: bookingTemplate.event_date,
      available: false
    }
    
    return Promise.all([postAvailability(availabilityObject), postBooking(token, bookingTemplate)]).then((response) => {
      console.log(response[0])
      console.log(response[1])
    }).catch((err) => {
      console.log(err)
    })

  };

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView>
          <View style={styles.rootContainer}>
            <Image
              style={styles.image}
              source={{ uri: entertainer.profile_img_url }}
            />
            <Text>Make a reservation with {entertainer.entertainer_name}!</Text>
            <Text style={styles.label}>Select a date</Text>
            <View>
              <Calendar
                minDate={firstDayOfCurrentMonth}
                markedDates={markedDates}
                onDayPress={onDayPress}
              />
              <View style={styles.inputContainer}>
              <Text style={styles.label} value={bookingTemplate.event_details}>
                Enter event details:
              </Text>
              <TextInput
                style={[styles.input, styles.inputMultiLine]}
                onChangeText={handleChange.bind(this, "event_details")}
                multiline={true}
                numberOfLines={3}
                placeholder="Please inform the entertainer on the type of event and suggest a time!"
              ></TextInput>
              <Text style={styles.label}>Enter address:</Text>
              <TextInput
                style={styles.input}
                value={bookingTemplate.address}
                onChangeText={handleChange.bind(this, "address")}
                textAlignVertical="top"
              ></TextInput>
              </View>
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Confirm Booking" onPress={handleConfirmBooking} />
              <Button title="Back" onPress={onShowEntertainers} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default BookingForm;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  scrollItem: {
    //flex: 1,
  },
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
    width: "80%",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-evenly",
  },
  buttonWrapper: {
    marginVertical: 8,
  },
  label: {
    fontSize: 18,
    color: GlobalStyles.colors.primary100,
    color: "black",
    marginBottom: 4,
    textAlign: "center",
  },
  input: {
    backgroundColor: GlobalStyles.colors.primary100,
    color: GlobalStyles.colors.primary700,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
  },
  inputMultiLine: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  invalidLabel: {
    color: GlobalStyles.colors.error500,
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.error50,
  },
  bigOR: {
    fontSize: 32,
    marginVertical: 24,
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
});
