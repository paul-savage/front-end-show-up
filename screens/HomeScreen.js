import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../context/global-context";
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
  const [entertainers, setEntertainers] = useState([]);
  const [error, setError] = useState(null);
  const [entertainer, setEntertainer] = useState(null);
  const [locations, setLocations] = useState(["All", "London", "Oxford"]);
  const [categories, setCategories] = useState(["All", "Juggler", "Violinist"]);
  // choice of screen:
  // 0 - list all entertainers
  // 1 = list single entertainer's details
  const [screen, setScreen] = useState(0);

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

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (screen === 0) {
    return (
      <ListEntertainers
        entertainers={entertainers}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setScreen={setScreen}
        setEntertainer={setEntertainer}
        locations={locations}
        categories={categories}
      />
    );
  }

  if (screen === 1) {
    return (
      <EntertainerDetail entertainer={entertainer} setScreen={setScreen} />
    );
  }

  if(screen === 2) {
    return (
      <BookingForm entertainer={entertainer} setScreen={setScreen} />
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
});
