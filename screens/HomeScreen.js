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

function HomeScreen() {
  const [searchParams, setSearchParams] = useState({});
  const [isLoading, setIsloading] = useState(true);
  const [entertainers, setEntertainers] = useState([]);
  const [error, setError] = useState(null);
  const [entertainer, setEntertainer] = useState(null);
  // choice of screen:
  // 0 - list all entertainers
  // 1 = list single entertainer's details
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    getEntertainers(searchParams)
      .then((data) => {
        setEntertainers(data);
        setIsloading(false);
      })
      .catch((err) => {
        setError("Error fetching entertainers");
        setIsloading(false);
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
      />
    );
  }

  if (screen === 1) {
    return (
      <EntertainerDetail entertainer={entertainer} setScreen={setScreen} />
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
