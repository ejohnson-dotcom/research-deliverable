import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { colors } from "@/constants/theme";
import { API_URL } from "@/components/api";

type Gem = {
  id: number;
  name: string;
  category: string;
  description?: string | null;
  latitude: number;
  longitude: number;
};
type Coord = { latitude: number; longitude: number };

const CATEGORIES = [
  "Speakeasy",
  "Café",
  "Nature",
  "Dining",
  "Vintage",
  "Other",
];

export default function Explore() {
  const [gems, setGems] = useState<Gem[]>([]);
  const [placing, setPlacing] = useState(false);
  const [draft, setDraft] = useState<Coord | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [error, setError] = useState("");

  const loadGems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/gems`);
      if (!res.ok) throw new Error();
      setGems(await res.json());
      setError("");
    } catch {
      setError(`Could not reach ${API_URL}`);
    }
  };

  useEffect(() => {
    loadGems();
  }, []);

  // Only places a pin when "Add Gem" mode is on
  const onMapPress = (e: { nativeEvent: { coordinate: Coord } }) => {
    if (!placing) return;
    setDraft(e.nativeEvent.coordinate);
    setPlacing(false);
    setName("");
    setDescription("");
    setCategory("Other");
    setError("");
  };

  const saveGem = async () => {
    if (!draft || !name.trim()) {
      setError("Give your gem a name");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/gems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, category, ...draft }),
      });
      if (!res.ok) throw new Error();
      setDraft(null);
      setError("");
      loadGems();
    } catch {
      setError("Save failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapArea}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 40.7265,
            longitude: -73.9815,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
          onPress={onMapPress}
        >
          {gems.map((g) => (
            <Marker
              key={g.id}
              coordinate={{ latitude: g.latitude, longitude: g.longitude }}
              title={g.name}
              description={g.description || g.category}
            />
          ))}
          {draft && <Marker coordinate={draft} pinColor={colors.success} />}
        </MapView>

        {/* Add Gem button: sibling of the map, top left, under the header */}
        <Pressable
          style={styles.addButton}
          onPress={() => setPlacing((p) => !p)}
        >
          <Text style={styles.addText}>{placing ? "Cancel" : "+ Add Gem"}</Text>
        </Pressable>

        {placing && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Tap the map to place your gem</Text>
          </View>
        )}

        {!!error && !draft && <Text style={styles.error}>{error}</Text>}
      </View>

      {/* Form */}
      <Modal
        visible={!!draft}
        transparent
        animationType="slide"
        onRequestClose={() => setDraft(null)}
      >
        <KeyboardAvoidingView
          style={styles.sheetWrap}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Tap the dimmed area above the form to dismiss the keyboard */}
          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} />

          <View style={styles.sheet}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              <Text style={styles.title}>Add a Gem</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Why is it special?"
                value={description}
                onChangeText={setDescription}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              <View style={styles.chips}>
                {CATEGORIES.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[styles.chip, c === category && styles.chipOn]}
                  >
                    <Text
                      style={
                        c === category ? styles.chipTextOn : styles.chipText
                      }
                    >
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {!!error && <Text style={styles.formError}>{error}</Text>}
              <View style={styles.row}>
                <Pressable style={styles.cancel} onPress={() => setDraft(null)}>
                  <Text>Cancel</Text>
                </Pressable>
                <Pressable style={styles.save} onPress={saveGem}>
                  <Text style={styles.saveText}>Save Gem</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mapArea: { flex: 1 },
  map: { flex: 1 },
  addButton: {
    position: "absolute",
    top: 12,
    left: 16,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  addText: { color: colors.primary, fontWeight: "700" },
  banner: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 12,
  },
  bannerText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  error: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    color: colors.alert,
    fontWeight: "600",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  formError: { color: colors.alert },
  sheetWrap: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.textHeading },
  input: { backgroundColor: colors.surface, borderRadius: 12, padding: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: colors.primary },
  chipText: { color: colors.textBody, fontWeight: "600" },
  chipTextOn: { color: "#fff", fontWeight: "600" },
  row: { flexDirection: "row", gap: 10 },
  cancel: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  save: {
    flex: 2,
    padding: 14,
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
