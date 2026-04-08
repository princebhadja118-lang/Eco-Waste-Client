import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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
  paper: "📄",
  unknown: "🗑️",
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, categories: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/history");
        const categories = {};
        data.scans.forEach((s) => {
          categories[s.wasteCategory] = (categories[s.wasteCategory] || 0) + 1;
        });
        setStats({ total: data.scans.length, categories });
      } catch {
        setStats({ total: 0, categories: {} });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const topCategory = Object.entries(stats.categories).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-green-900 items-center pt-8 pb-10">
          <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center mb-3">
            <Text className="text-4xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-white">{user?.name}</Text>
          <Text className="text-white/70 text-sm mt-1">{user?.email}</Text>
          <View className="bg-white/20 px-5 py-2 rounded-full mt-3">
            <Text className="text-white font-semibold text-sm">
              🌱 Eco Member
            </Text>
          </View>
        </View>

        <View className="px-4 -mt-5">
          {/* Stats */}
          {loading ? (
            <ActivityIndicator color="#2e7d32" className="my-5" />
          ) : (
            <>
              <View className="flex-row justify-between mb-5">
                {[
                  { number: stats.total, label: "Total Scans" },
                  {
                    number: Object.keys(stats.categories).length,
                    label: "Categories",
                  },
                  {
                    number: topCategory ? CATEGORY_ICONS[topCategory[0]] : "🗑️",
                    label: "Top Category",
                  },
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

              {/* Breakdown */}
              {Object.keys(stats.categories).length > 0 && (
                <>
                  <Text className="text-base font-bold text-green-900 mb-3">
                    Scan Breakdown
                  </Text>
                  {Object.entries(stats.categories)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, count]) => (
                      <View
                        key={cat}
                        className="flex-row items-center bg-white rounded-2xl p-3 mb-2 shadow-sm"
                      >
                        <Text className="text-xl mr-3">
                          {CATEGORY_ICONS[cat] || "🗑️"}
                        </Text>
                        <Text className="text-sm font-semibold text-gray-700 w-20">
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Text>
                        <View className="flex-1 h-2 bg-gray-100 rounded-full mx-3">
                          <View
                            className="h-2 bg-green-700 rounded-full"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </View>
                        <Text className="text-sm font-bold text-green-700">
                          {count}
                        </Text>
                      </View>
                    ))}
                </>
              )}
            </>
          )}

          {/* Menu */}
          <Text className="text-base font-bold text-green-900 mt-4 mb-3">
            Account
          </Text>
          <View className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden">
            {[
              {
                icon: "📋",
                label: "Scan History",
                onPress: () => router.push("/(tabs)/history"),
              },
              {
                icon: "📷",
                label: "Scan Waste",
                onPress: () => router.push("/(tabs)"),
              },
              {
                icon: "🚪",
                label: "Logout",
                onPress: async () => {
                  await logout();
                  router.replace("/(auth)/login");
                },
                danger: true,
              },
            ].map((item, i, arr) => (
              <View key={i}>
                <TouchableOpacity
                  className="flex-row items-center p-4"
                  onPress={item.onPress}
                >
                  <Text className="text-xl mr-4">{item.icon}</Text>
                  <Text
                    className={`flex-1 text-base font-medium ${item.danger ? "text-red-600" : "text-gray-700"}`}
                  >
                    {item.label}
                  </Text>
                  <Text className="text-2xl text-gray-300">›</Text>
                </TouchableOpacity>
                {i < arr.length - 1 && (
                  <View className="h-px bg-gray-100 mx-4" />
                )}
              </View>
            ))}
          </View>

          <Text className="text-center text-gray-300 text-xs mb-6">
            EcoWaste v1.0.0 • Made with 💚
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
