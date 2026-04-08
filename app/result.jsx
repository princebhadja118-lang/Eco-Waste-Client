import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const HAZARD_HEX = { low: "#2e7d32", medium: "#f57c00", high: "#c62828" };

export default function ResultScreen() {
  const { result } = useLocalSearchParams();
  const router = useRouter();
  const data = JSON.parse(result);
  const bgColor = CATEGORY_HEX[data.wasteCategory] || "#555";

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View
          className="items-center pt-10 pb-8 px-6"
          style={{ backgroundColor: bgColor }}
        >
          <Image
            className="text-8xl mb-3"
            source={{ uri: `data:image/jpeg;base64,${data.imageUrl}` }}
          />
          <Text className="text-2xl font-bold text-white text-center mb-1">
            {data.itemName}
          </Text>
          <Text className="text-white/70 text-xs tracking-widest mb-5">
            {data.wasteCategory?.toUpperCase()}
          </Text>
          <View className="flex-row gap-2">
            <View
              className={`px-4 py-2 rounded-full ${data.isRecyclable ? "bg-green-500" : "bg-red-500"}`}
            >
              <Text className="text-white font-bold text-xs">
                {data.isRecyclable ? "♻️ Recyclable" : "🚫 Not Recyclable"}
              </Text>
            </View>
            <View
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: HAZARD_HEX[data.hazardLevel] || "#666",
              }}
            >
              <Text className="text-white font-bold text-xs">
                ⚠️ {data.hazardLevel?.toUpperCase()} Risk
              </Text>
            </View>
          </View>
        </View>

        <View className="p-4">
          {/* Disposal */}
          <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <Text className="text-base font-bold text-gray-800 mb-2">
              🗑️ How to Dispose
            </Text>
            <Text className="text-sm text-gray-600 leading-6">
              {data.disposalTip}
            </Text>
          </View>

          {/* Impact */}
          <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <Text className="text-base font-bold text-gray-800 mb-2">
              🌍 Environmental Impact
            </Text>
            <Text className="text-sm text-gray-600 leading-6">
              {data.environmentalImpact}
            </Text>
          </View>

          {/* Info Row */}
          <View className="flex-row justify-between mb-5">
            {[
              { icon: "📦", label: "Category", value: data.wasteCategory },
              {
                icon: "♻️",
                label: "Recyclable",
                value: data.isRecyclable ? "Yes" : "No",
              },
              { icon: "⚠️", label: "Hazard", value: data.hazardLevel },
            ].map((item, i) => (
              <View
                key={i}
                className="flex-1 bg-white rounded-2xl p-3 items-center mx-1 shadow-sm"
              >
                <Text className="text-xl mb-1">{item.icon}</Text>
                <Text className="text-xs text-gray-400 mb-1">{item.label}</Text>
                <Text className="text-xs font-bold text-gray-700 capitalize">
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            className="py-4 rounded-2xl items-center mb-3"
            style={{ backgroundColor: bgColor }}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text className="text-white text-base font-bold">
              📷 Scan Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 rounded-2xl items-center border-2 border-gray-200 mb-5"
            onPress={() => router.replace("/(tabs)/history")}
          >
            <Text className="text-base font-bold" style={{ color: bgColor }}>
              View History
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
