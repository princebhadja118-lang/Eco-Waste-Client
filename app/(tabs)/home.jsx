import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  plastic: "bg-blue-800",
  organic: "bg-green-800",
  metal: "bg-amber-900",
  glass: "bg-cyan-700",
  electronic: "bg-purple-900",
  hazardous: "bg-red-800",
  unknown: "bg-gray-600",
};

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [recentScans, setRecentScans] = useState([]);
  const [totalScans, setTotalScans] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const { data } = await api.get("/history");
        setTotalScans(data.scans.length);
        setRecentScans(data.scans.slice(0, 3));
      } catch {
        setRecentScans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center pt-4 mb-5">
          <View>
            <Text className="text-2xl font-bold text-green-900">
              Hello, {user?.name?.split(" ")[0]} 👋
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Lets scan some waste today!
            </Text>
          </View>
          <TouchableOpacity
            className="bg-red-50 px-4 py-2 rounded-full"
            onPress={async () => {
              await logout();
              router.replace("/(auth)/login");
            }}
          >
            <Text className="text-red-700 font-bold text-sm">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View className="bg-green-800 rounded-3xl p-6 items-center mb-5">
          <Text className="text-5xl mb-3">♻️</Text>
          <Text className="text-white text-xl font-bold mb-1">
            EcoWaste Scanner
          </Text>
          <Text className="text-white/70 text-sm text-center mb-5">
            Scan waste & get disposal tips instantly
          </Text>
          <TouchableOpacity
            className="bg-white px-8 py-3 rounded-full"
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-green-800 font-bold text-base">
              📷 Start Scanning
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between mb-6">
          {[
            { number: totalScans, label: "Total Scans" },
            { number: "🌍", label: "Eco Friendly" },
            { number: "🏆", label: "Top Scanner" },
          ].map((stat, i) => (
            <View
              key={i}
              className="flex-1 bg-white rounded-2xl p-4 items-center mx-1 shadow-sm"
            >
              <Text className="text-2xl font-bold text-green-900 mb-1">
                {stat.number}
              </Text>
              <Text className="text-xs text-gray-500 text-center">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <Text className="text-base font-bold text-green-900 mb-3">
          Waste Categories
        </Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {Object.entries(CATEGORY_ICONS).map(([key, icon]) => (
            <View
              key={key}
              className={`w-[30%] ${CATEGORY_COLORS[key]} rounded-2xl p-3 items-center mb-3`}
            >
              <Text className="text-2xl mb-1">{icon}</Text>
              <Text className="text-white text-xs font-semibold">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        {/* Recent Scans */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base font-bold text-green-900">
            Recent Scans
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
            <Text className="text-green-700 font-bold text-sm">See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#2e7d32" className="mt-4" />
        ) : recentScans.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Text className="text-4xl mb-3">🗑️</Text>
            <Text className="text-gray-400 text-sm">
              No scans yet. Start scanning!
            </Text>
          </View>
        ) : (
          recentScans.map((scan) => (
            <View
              key={scan._id}
              className="flex-row bg-white rounded-2xl p-4 mb-3 items-center shadow-sm"
            >
              <Image
                source={{ uri: `data:image/jpeg;base64,${scan.imageUrl}` }}
                className="w-14 h-14 mr-2 rounded"
              />
              <View className="flex-1">
                <Text className="text-sm font-bold text-gray-800">
                  {scan.wasteCategory.toUpperCase()}
                </Text>
                <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
                  {scan.disposalTip}
                </Text>
                <Text className="text-xs text-gray-400 mt-1">
                  {new Date(scan.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
