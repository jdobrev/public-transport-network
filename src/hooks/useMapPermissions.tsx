import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { View } from "@/components/View";
import ActivityIndicator from "@/components/ActivityIndicator";
import { StyleSheet } from "react-native";

//TODO update hook to not return jsx itself. Handle denied permissions in the component that uses this hook
export default function useMapPermissions() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location required",
          "We need location permission to show your position on the map."
        );
        setHasPermission(false);
      } else {
        setHasPermission(true);
      }
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
