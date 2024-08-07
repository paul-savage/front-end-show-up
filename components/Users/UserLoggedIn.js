import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { GlobalContext } from "../../context/global-context";
import { uploadFile, deleteEntertainer } from "../../utils/apicalls";

const UserLoggedIn = ({ locations, categories, gotoLoggingIn }) => {
  const { user, setUser, setToken, setIsLoggedIn, token } =
    useContext(GlobalContext);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]); // State to store uploaded media files
  const [editedUser, setEditedUser] = useState({
    category: user.category,
    location: user.location,
    description: user.description,
    price: user.price,
  });

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setUser({});
    setToken("");
    gotoLoggingIn();
  };

  const handleEditProfile = () => {
    setEditMode(!editMode);
  };

  const handleSaveProfile = () => {
    setUser({ ...user, ...editedUser });
    setEditMode(false);
  };

  const handleChange = (key, value) => {
    setEditedUser({ ...editedUser, [key]: value });
  };

  const handleChooseProfilePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const file = {
        uri: asset.uri,
        name: asset.uri.split("/").pop(),
        type: asset.type || "image/jpeg",
      };

      setUploading(true);
      uploadFile(file, token)
        .then((res) => {
          setUploadedImage(asset.uri);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
        });
    }
  };

  const handleChooseMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const files = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.uri.split("/").pop(),
        type: asset.type || "image/jpeg",
      }));

      setUploading(true);
      const uploadPromises = files.map((file) => uploadFile(file, token));

      Promise.all(uploadPromises)
        .then((responses) => {
          const uris = responses.map((res, index) => files[index].uri);
          setMediaFiles((prev) => [...prev, ...uris]);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
        });
    }
  };

  const handleDeleteEntertainer = () => {
    Alert.alert("Confirm Account deletion", "Delete Account?", [
      {
        text: "Cancel",
        onPress: () => console.log("deletion cancelled"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteEntertainer(user.user_id)
            .then(() => {
              console.log("Entertainer deleted");
            })
            .catch((err) => {
              console.log("Error deleting entertainer");
            });
          setIsLoggedIn(false);
          setUser({});
          setToken("");
          gotoLoggingIn();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.rootContainer}>
          <View style={styles.card}>
            <Image
              style={styles.avatar}
              source={{ uri: uploadedImage || user.profile_img_url }}
            />
            <Text style={styles.eName}>{user.entertainer_name}</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.label}>Username: {user.username}</Text>
              <Text style={styles.label}>
                Name: {user.first_name} {user.last_name}
              </Text>
              <Text style={styles.label}>Email: {user.email}</Text>
              <Text style={styles.label}>User Type: {user.user_type}</Text>
              {user.user_type === "Entertainer" && (
                <>
                  <Text style={styles.label}>Category:</Text>
                  {editMode ? (
                    <Picker
                      selectedValue={editedUser.category}
                      style={styles.picker}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      {categories.map((category) => (
                        <Picker.Item
                          key={category.category}
                          label={category.category}
                          value={category.category}
                        />
                      ))}
                    </Picker>
                  ) : (
                    <Text style={styles.value}>{user.category}</Text>
                  )}
                  <Text style={styles.label}>Location:</Text>
                  {editMode ? (
                    <Picker
                      selectedValue={editedUser.location}
                      style={styles.picker}
                      onValueChange={(value) => handleChange("location", value)}
                    >
                      {locations.map((location) => (
                        <Picker.Item
                          key={location.location}
                          label={location.location}
                          value={location.location}
                        />
                      ))}
                    </Picker>
                  ) : (
                    <Text style={styles.value}>{user.location}</Text>
                  )}
                  <Text style={styles.label}>Description:</Text>
                  {editMode ? (
                    <TextInput
                      style={styles.input}
                      value={editedUser.description}
                      onChangeText={(value) =>
                        handleChange("description", value)
                      }
                    />
                  ) : (
                    <Text style={styles.value}>{user.description}</Text>
                  )}
                  <Text style={styles.label}>Price:</Text>
                  {editMode ? (
                    <TextInput
                      style={styles.input}
                      value={String(editedUser.price)}
                      keyboardType="numeric"
                      onChangeText={(value) => handleChange("price", value)}
                    />
                  ) : (
                    <Text style={styles.value}>£{user.price}</Text>
                  )}
                </>
              )}
            </View>
            {editMode ? (
              <TouchableOpacity
                style={styles.button}
                onPress={handleSaveProfile}
              >
                <Text style={styles.buttonText}>Save Profile</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={handleEditProfile}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
            {user.user_type === "Entertainer" && (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleDeleteEntertainer}
                >
                  <Text style={styles.buttonText}>Delete Profile</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={handleChooseProfilePhoto}
            >
              <Text style={styles.buttonText}>Upload Profile Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleChooseMedia}>
              <Text style={styles.buttonText}>Upload Media</Text>
            </TouchableOpacity>
            {uploading && <ActivityIndicator size="large" color="#0000ff" />}
            {uploadedImage && (
              <Image
                source={{ uri: uploadedImage }}
                style={styles.uploadedImage}
              />
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogOut}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserLoggedIn;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  rootContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  eName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 8,
  },
  profileInfo: {
    width: "100%",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginVertical: 4,
    textAlign: "left",
    width: "100%",
  },
  value: {
    fontSize: 16,
    color: "#000",
    marginVertical: 4,
    textAlign: "left",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
  },
  picker: {
    width: "100%",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "darkslateblue",
    padding: 3,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    width: "70%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 1,
    width: 100,
    height: 30,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 16,
  },
});
