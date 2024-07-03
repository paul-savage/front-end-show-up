import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../context/global-context";
import { getEntertainers } from "../utils/apicalls";
import LoadingOverlay from "../components/LoadingOverlay";
import ListEntertainers from "../components/ListEntertainers";

function HomeScreen() {
  const [searchParams, setSearchParams] = useState({});
  const [isLoading, setIsloading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEntertainers(searchParams)
      .then((res) => {
        setItems(res);
        setIsloading(false);
      })
      .catch((err) => {
        setError("Error fetching entertainers");
      });
  }, []);

  if (error) {
    return (
      <View style={styles.rootContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <ListEntertainers
      items={items}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
    />
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
