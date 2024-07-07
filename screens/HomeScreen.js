import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import {
  getEntertainers,
  getLocations,
  getCategories,
} from "../utils/apicalls";
import LoadingOverlay from "../components/LoadingOverlay";
import ListEntertainers from "../components/ListEntertainers";
import EntertainerDetail from "../components/EntertainerDetail";
import BookingForm from "../components/BookingForm";

function HomeScreen() {
  const [searchParams, setSearchParams] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entertainers, setEntertainers] = useState([]);
  const [entertainer, setEntertainer] = useState(null);
  const [locations, setLocations] = useState(["All"]);
  const [categories, setCategories] = useState(["All"]);

  const HS_ENTERTAINERS = 0;
  const HS_ENTERTAINER_DETAIL = 1;
  const HS_BOOKING_FORM = 2;
  const [homeState, setHomeState] = useState(HS_ENTERTAINERS);

  useEffect(() => {
    Promise.all([
      getEntertainers(searchParams),
      getLocations(),
      getCategories(),
    ])
      .then((arr) => {
        setEntertainers(arr[0]);
        const locs = ["All"];
        arr[1].forEach((loc) => locs.push(loc.location));
        const cats = ["All"];
        arr[2].forEach((cat) => cats.push(cat.category));
        setLocations(locs);
        setCategories(cats);
        setIsLoading(false);
      })
      .catch((err) => {
        // NB: empty arrays should not be errors
        setError("Error fetching entertainer data");
        setIsLoading(false);
      });
  }, [searchParams]);

  // if (error) {
  //   return (
  //     <View style={styles.rootContainer}>
  //       <Text>{error}</Text>
  //     </View>
  //   );
  // }

  function updateHomeState(value) {
    setHomeState(value);
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  switch (homeState) {
    case HS_ENTERTAINERS:
      return (
        <ListEntertainers
          entertainers={entertainers}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          setEntertainer={setEntertainer}
          locations={locations}
          categories={categories}
          onShowDetails={updateHomeState.bind(this, HS_ENTERTAINER_DETAIL)}
        />
      );
      break;
    case HS_ENTERTAINER_DETAIL:
      return (
        <EntertainerDetail
          entertainer={entertainer}
          onShowEntertainers={updateHomeState.bind(this, HS_ENTERTAINERS)}
          onBookingForm={updateHomeState.bind(this, HS_BOOKING_FORM)}
        />
      );
    case HS_BOOKING_FORM:
      return (
        <BookingForm
          entertainer={entertainer}
          onShowEntertainers={updateHomeState.bind(this, HS_ENTERTAINERS)}
        />
      );
    default:
      return (
        <View style={styles.rootContainer}>
          <Text>
            Error:{" "}
            <Text style={styles.highlight}>'homeState' = '{homeState}'</Text>{" "}
            unknown!
          </Text>
        </View>
      );
  }
}

export default HomeScreen;

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
