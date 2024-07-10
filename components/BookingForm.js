import { useEffect, useState, useContext } from "react";
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
  Modal,
  Pressable,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { GlobalStyles } from "../constants/styles";
import {
  getAvailability,
  postBooking,
  postAvailability,
} from "../utils/booking-form-api-call";
import moment from "moment";
import { GlobalContext } from "../context/global-context";

const BookingForm = ({ entertainer, onShowEntertainers }) => {
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState({});
  const firstDayOfCurrentMonth = moment().format("YYYY-MM-DD");
  const [modalVisible, setModalVisible] = useState(false);
  const { user, token } = useContext(GlobalContext);

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
    setBookingTemplate((current) => {
      return { ...current, [prop]: value };
    });
  };

  const handleConfirmBooking = () => {
    const availabilityObject = {
      entertainer_id: entertainer.user_id,
      date: bookingTemplate.event_date,
      available: false,
    };

    return Promise.all([
      postAvailability(availabilityObject),
      postBooking(token, bookingTemplate),
    ])
      .then((response) => {
        setModalVisible(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
                <Text
                  style={styles.label}
                  value={bookingTemplate.event_details}
                >
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
              <Pressable style={styles.button} onPress={handleConfirmBooking}>
                <Text style={styles.buttonText}>Confirm Booking</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={onShowEntertainers}>
                <Text style={styles.buttonText}>Return to Home</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            onShowEntertainers();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Booking Confirmed!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  onShowEntertainers();
                }}
              >
                <Text style={styles.textStyle}>Return to Home</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable>
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  label: {
    fontSize: 16,
    color: GlobalStyles.colors.primary100,
    color: "#483D8B",
    marginBottom: 8,
    marginTop: 20,
    textAlign: "left",
  },
  input: {
    backgroundColor: "#BEB3F2",
    color: GlobalStyles.colors.primary700,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
  },
  inputMultiLine: {
    height: 100,
    width: 350,
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
    borderRadius: 20,
    marginBottom: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    height: 150,
    width: 400,
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
    backgroundColor: "#483D8B",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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
