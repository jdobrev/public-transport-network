import { Stack } from "expo-router";
export default function LineLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[lineId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
