import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth-context";
import api from "@/constants/api";

const CATEGORY_ICONS = {
  plastic: "🧴",
  organic: "🌿",
  metal: "🔩",
  glass: "🪟",
  electronic: "📱",
  hazardous: "☣️",
  unknown: "🗑️",
};

const CATEGORY_COLORS = {
  plastic: "#1565c0",
  organic: "#2e7d32",
  metal: "#6d4c41",
  glass: "#00838f",
  electronic: "#6a1b9a",
  hazardous: "#c62828",
  unknown: "#555",
};

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const { data } = await api.get("/history");
        setRecentScans(data.scans.slice(0, 3));
      } catch {
        setRecentScans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name?.split(" ")[0]} 👋
            </Text>
            <Text style={styles.subGreeting}>Lets scan some waste today!</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>♻️</Text>
          <Text style={styles.bannerTitle}>EcoWaste Scanner</Text>
          <Text style={styles.bannerSubtitle}>
            Scan waste & get disposal tips instantly
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.scanButtonText}>📷 Start Scanning</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {recentScans.length > 0 ? "✅" : "0"}
            </Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>🌍</Text>
            <Text style={styles.statLabel}>Eco Friendly</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>🏆</Text>
            <Text style={styles.statLabel}>Top Scanner</Text>
          </View>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Waste Categories</Text>
        <View style={styles.categoriesGrid}>
          {Object.entries(CATEGORY_ICONS).map(([key, icon]) => (
            <View
              key={key}
              style={[
                styles.categoryCard,
                { backgroundColor: CATEGORY_COLORS[key] },
              ]}
            >
              <Text style={styles.categoryIcon}>{icon}</Text>
              <Text style={styles.categoryName}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        {/* Recent Scans */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#2e7d32" style={{ marginTop: 16 }} />
        ) : recentScans.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🗑️</Text>
            <Text style={styles.emptyText}>No scans yet. Start scanning!</Text>
          </View>
        ) : (
          recentScans.map((scan) => (
            <View key={scan._id} style={styles.scanCard}>
              <View
                style={[
                  styles.scanIconBox,
                  { backgroundColor: CATEGORY_COLORS[scan.wasteCategory] },
                ]}
              >
                <Text style={styles.scanIcon}>
                  {CATEGORY_ICONS[scan.wasteCategory]}
                </Text>
              </View>
              <View style={styles.scanInfo}>
                <Text style={styles.scanCategory}>
                  {scan.wasteCategory.toUpperCase()}
                </Text>
                <Text style={styles.scanTip} numberOfLines={1}>
                  {scan.disposalTip}
                </Text>
                <Text style={styles.scanDate}>
                  {new Date(scan.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f4f0" },
  container: { flex: 1, paddingHorizontal: 16 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 20,
  },
  greeting: { fontSize: 22, fontWeight: "bold", color: "#1b5e20" },
  subGreeting: { fontSize: 13, color: "#666", marginTop: 2 },
  logoutBtn: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: { color: "#c62828", fontWeight: "bold", fontSize: 13 },

  // Banner
  banner: {
    backgroundColor: "#2e7d32",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  bannerIcon: { fontSize: 48, marginBottom: 8 },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  scanButtonText: { color: "#2e7d32", fontWeight: "bold", fontSize: 15 },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
  },
  statNumber: { fontSize: 24, marginBottom: 4 },
  statLabel: { fontSize: 11, color: "#666", textAlign: "center" },

  // Categories
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  categoryCard: {
    width: "30%",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  categoryIcon: { fontSize: 26, marginBottom: 4 },
  categoryName: { fontSize: 11, color: "#fff", fontWeight: "600" },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAll: { color: "#2e7d32", fontWeight: "bold", fontSize: 13 },

  // Scan Cards
  scanCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
  },
  scanIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  scanIcon: { fontSize: 24 },
  scanInfo: { flex: 1 },
  scanCategory: { fontSize: 14, fontWeight: "bold", color: "#333" },
  scanTip: { fontSize: 12, color: "#888", marginTop: 2 },
  scanDate: { fontSize: 11, color: "#aaa", marginTop: 4 },

  // Empty
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 30,
    alignItems: "center",
  },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: "#aaa", fontSize: 14 },
});
