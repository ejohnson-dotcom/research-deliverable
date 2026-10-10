import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/constants/theme";

type Props = {
  placing: boolean;
  onAddGem: () => void;
};

export default function ExploreHeader({ placing, onAddGem }: Props) {
  return (
    <SafeAreaView edges={["top"]} style={styles.wrapper}>
      <View style={styles.row}>
        <Pressable style={styles.addButton} onPress={onAddGem}>
          <Ionicons
            name={placing ? "close" : "add"}
            size={18}
            color={colors.primary}
          />
          <Text style={styles.addText}>{placing ? "Cancel" : "Add Gem"}</Text>
        </Pressable>

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
    paddingVertical: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  addText: { color: colors.primary, fontWeight: "700" },
  logoGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { fontSize: 20, fontWeight: "800", color: colors.textHeading },
  beta: {
    backgroundColor: "#FBE3E0",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  betaText: { color: colors.alert, fontSize: 10, fontWeight: "700" },
});
