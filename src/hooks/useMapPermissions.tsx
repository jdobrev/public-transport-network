import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { View } from "@/components/View";
import ActivityIndicator from "@/components/ActivityIndicator";
import { StyleSheet } from "react-native";

export default function useMapPermissions() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
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
