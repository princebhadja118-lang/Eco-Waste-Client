import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import api from "@/constants/api";

const CATEGORY_HEX = {
  plastic: "#1565c0",
  organic: "#2e7d32",
  metal: "#6d4c41",
  glass: "#00838f",
  electronic: "#6a1b9a",
  hazardous: "#c62828",
  paper: "#f57c00",
  unknown: "#555",
};

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

  if (loading)
    return (
      <ActivityIndicator className="flex-1" size="large" color="#2e7d32" />
    );

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-4 mb-3">
        <View>
          <Text className="text-2xl font-bold text-green-900">
            📋 Scan History
          </Text>
          {scans.length > 0 && (
            <Text className="text-gray-400 text-xs mt-1">
              {scans.length} scans found
            </Text>
          )}
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

      <FlatList
        data={scans}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row bg-white rounded-2xl p-4 mb-3 items-center shadow-sm"
            onPress={() => setSelected(item)}
          >
            <Image
              source={{ uri: `data:image/jpeg;base64,${item.imageUrl}` }}
              className="w-14 h-14 mr-2 rounded"
            />

            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-800">
                {item.wasteCategory?.toUpperCase()}
              </Text>
              <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
                {item.disposalTip}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                {new Date(item.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
            <Text className="text-2xl text-gray-300 ml-2">›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Text className="text-6xl mb-4">🗑️</Text>
            <Text className="text-lg font-bold text-gray-400">
              No scans yet
            </Text>
            <Text className="text-sm text-gray-300 mt-2">
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
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-green-50 rounded-t-3xl max-h-[90%]">
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View
                  className="items-center py-8 rounded-t-3xl"
                  style={{
                    backgroundColor:
                      CATEGORY_HEX[selected.wasteCategory] || "#555",
                  }}
                >
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${selected.imageUrl}`,
                    }}
                    className="h-32 w-32 rounded"
                  />
                  <Text className="text-xl font-bold text-white text-center">
                    {selected.labels?.[0]?.description || "Unknown Item"}
                  </Text>
                  <Text className="text-white/70 text-xs tracking-widest mt-1">
                    {selected.wasteCategory?.toUpperCase()}
                  </Text>
                </View>

                <View className="p-4">
                  {/* Badges */}
                  {(selected.isRecyclable !== undefined ||
                    selected.hazardLevel) && (
                    <View className="flex-row gap-2 mb-4">
                      {selected.isRecyclable !== undefined && (
                        <View
                          className={`px-4 py-2 rounded-full ${selected.isRecyclable ? "bg-green-500" : "bg-red-500"}`}
                        >
                          <Text className="text-white font-bold text-xs">
                            {selected.isRecyclable
                              ? "♻️ Recyclable"
                              : "🚫 Not Recyclable"}
                          </Text>
                        </View>
                      )}
                      {selected.hazardLevel && (
                        <View className="px-4 py-2 rounded-full bg-orange-500">
                          <Text className="text-white font-bold text-xs">
                            ⚠️ {selected.hazardLevel?.toUpperCase()} Risk
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Disposal */}
                  <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                    <Text className="text-base font-bold text-gray-800 mb-2">
                      🗑️ How to Dispose
                    </Text>
                    <Text className="text-sm text-gray-600 leading-6">
                      {selected.disposalTip}
                    </Text>
                  </View>

                  {/* Impact */}
                  {selected.environmentalImpact && (
                    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                      <Text className="text-base font-bold text-gray-800 mb-2">
                        🌍 Environmental Impact
                      </Text>
                      <Text className="text-sm text-gray-600 leading-6">
                        {selected.environmentalImpact}
                      </Text>
                    </View>
                  )}

                  <Text className="text-xs text-gray-400 text-center mb-4">
                    🕒 Scanned on{" "}
                    {new Date(selected.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>

                  <TouchableOpacity
                    className="py-4 rounded-2xl items-center mb-3"
                    style={{
                      backgroundColor:
                        CATEGORY_HEX[selected.wasteCategory] || "#555",
                    }}
                    onPress={() => setSelected(null)}
                  >
                    <Text className="text-white text-base font-bold">
                      Close
                    </Text>
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
