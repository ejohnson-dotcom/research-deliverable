import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/constants/theme";

export default function AppHeader() {
  return (
    <SafeAreaView edges={["top"]} style={styles.wrapper}>
      <View style={styles.row}>
        <View style={styles.logoGroup}>
          <Text style={styles.logo}>Localfye</Text>
          <View style={styles.beta}>
            <Text style={styles.betaText}>BETA</Text>
          </View>
        </View>
        <Ionicons name="search" size={22} color={colors.textHeading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { fontSize: 22, fontWeight: "800", color: colors.textHeading },
  beta: {
    backgroundColor: "#FBE3E0",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  betaText: { color: colors.alert, fontSize: 10, fontWeight: "700" },
});
