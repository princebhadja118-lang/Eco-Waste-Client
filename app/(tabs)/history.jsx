import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import api from "@/constants/api";

const CATEGORY_ICONS = {
  plastic: "🧴",
  organic: "🌿",
  metal: "🔩",
  glass: "🪟",
  electronic: "📱",
  hazardous: "☣️",
  paper: "📄",
  unknown: "🗑️",
};

const CATEGORY_BG = {
  plastic: "#1565c0",
  organic: "#2e7d32",
  metal: "#6d4c41",
  glass: "#00838f",
  electronic: "#6a1b9a",
  hazardous: "#c62828",
  paper: "#f57c00",
  unknown: "#555",
};

const HAZARD_COLORS = { low: "#2e7d32", medium: "#f57c00", high: "#c62828" };

export default function HistoryScreen() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/history");
        setScans(data.scans);
      } catch {
        setScans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#2e7d32" />
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📋 Scan History</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Count */}
      {scans.length > 0 && (
        <Text style={styles.countText}>{scans.length} scans found</Text>
      )}

      <FlatList
        data={scans}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelected(item)}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: CATEGORY_BG[item.wasteCategory] || "#555" },
              ]}
            >
              <Text style={styles.cardIcon}>
                {CATEGORY_ICONS[item.wasteCategory] || "🗑️"}
              </Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardCategory}>
                {item.wasteCategory?.toUpperCase()}
              </Text>
              <Text style={styles.cardTip} numberOfLines={1}>
                {item.disposalTip}
              </Text>
              <Text style={styles.cardDate}>
                {new Date(item.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🗑️</Text>
            <Text style={styles.emptyText}>No scans yet</Text>
            <Text style={styles.emptySubText}>
              Start scanning waste to see history
            </Text>
          </View>
        }
      />

      {/* Detail Modal */}
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Modal Hero */}
                <View
                  style={[
                    styles.modalHero,
                    {
                      backgroundColor:
                        CATEGORY_BG[selected.wasteCategory] || "#555",
                    },
                  ]}
                >
                  <Text style={styles.modalIcon}>
                    {CATEGORY_ICONS[selected.wasteCategory] || "🗑️"}
                  </Text>
                  <Text style={styles.modalItemName}>
                    {selected.labels?.[0]?.description || "Unknown Item"}
                  </Text>
                  <Text style={styles.modalCategory}>
                    {selected.wasteCategory?.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.modalBody}>
                  {/* Badges */}
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: selected.isRecyclable
                            ? "#4caf50"
                            : "#ef5350",
                        },
                      ]}
                    >
                      <Text style={styles.badgeText}>
                        {selected.isRecyclable
                          ? "♻️ Recyclable"
                          : "🚫 Not Recyclable"}
                      </Text>
                    </View>
                    {selected.hazardLevel && (
                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor:
                              HAZARD_COLORS[selected.hazardLevel] || "#666",
                          },
                        ]}
                      >
                        <Text style={styles.badgeText}>
                          ⚠️ {selected.hazardLevel?.toUpperCase()} Risk
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Disposal Tip */}
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>🗑️ How to Dispose</Text>
                    <Text style={styles.infoCardText}>
                      {selected.disposalTip}
                    </Text>
                  </View>

                  {/* Environmental Impact */}
                  {selected.environmentalImpact && (
                    <View style={styles.infoCard}>
                      <Text style={styles.infoCardTitle}>
                        🌍 Environmental Impact
                      </Text>
                      <Text style={styles.infoCardText}>
                        {selected.environmentalImpact}
                      </Text>
                    </View>
                  )}

                  {/* Date */}
                  <Text style={styles.modalDate}>
                    🕒 Scanned on{" "}
                    {new Date(selected.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>

                  {/* Close Button */}
                  <TouchableOpacity
                    style={[
                      styles.closeBtn,
                      {
                        backgroundColor:
                          CATEGORY_BG[selected.wasteCategory] || "#555",
                      },
                    ]}
                    onPress={() => setSelected(null)}
                  >
                    <Text style={styles.closeBtnText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f4f0" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#1b5e20" },
  logoutBtn: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: { color: "#c62828", fontWeight: "bold", fontSize: 13 },
  countText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: "#888",
    marginBottom: 8,
  },

  // List
  list: { paddingHorizontal: 16, paddingBottom: 10, paddingTop: 5 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    alignItems: "center",
    elevation: 10,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardIcon: { fontSize: 26 },
  cardInfo: { flex: 1 },
  cardCategory: { fontSize: 14, fontWeight: "bold", color: "#333" },
  cardTip: { fontSize: 12, color: "#888", marginTop: 3 },
  cardDate: { fontSize: 11, color: "#aaa", marginTop: 3 },
  arrow: { fontSize: 24, color: "#ccc", marginLeft: 8 },

  // Empty
  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#aaa" },
  emptySubText: { fontSize: 13, color: "#ccc", marginTop: 6 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#f0f4f0",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHero: {
    alignItems: "center",
    paddingVertical: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalIcon: { fontSize: 64, marginBottom: 10 },
  modalItemName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  modalCategory: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 2,
    marginTop: 4,
  },
  modalBody: { padding: 16 },
  badgeRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  badge: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  infoCardText: { fontSize: 14, color: "#555", lineHeight: 22 },
  modalDate: {
    fontSize: 12,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 16,
  },
  closeBtn: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  closeBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
