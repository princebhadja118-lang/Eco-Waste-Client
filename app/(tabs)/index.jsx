import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "@/constants/api";

export default function CameraScreen() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-green-50 items-center justify-center px-8">
        <Text className="text-6xl mb-4">📷</Text>
        <Text className="text-2xl font-bold text-green-900 mb-2">
          Camera Access
        </Text>
        <Text className="text-gray-500 text-sm text-center mb-8">
          Waste scan karne ke liye camera permission chahiye
        </Text>
        <TouchableOpacity
          className="bg-green-800 px-10 py-4 rounded-2xl"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold text-base">Permission Do</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.3,
      });
      const raw = photo.base64.replace(/^data:image\/\w+;base64,/, "").trim();
      const { data } = await api.post("/scan", {
        imageBase64: raw,
        mimeType: "image/jpeg",
      });
      router.push({
        pathname: "/result",
        params: { result: JSON.stringify(data) },
      });
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black h-screen">
      <CameraView
        className="flex items-center justify-between h-full"
        facing={facing}
        ref={cameraRef}
      >
        <View className="h-screen flex justify-between">
          {/* Top Header */}
          <SafeAreaView className="items-center pt-2 pb-3 bg-black/40">
            <Text className="text-white text-xl font-bold">♻️ EcoWaste</Text>
            <Text className="text-white/70 text-xs mt-1">
              Point camera at waste to scan
            </Text>
          </SafeAreaView>

          {/* Controls */}
          <View className="flex-row items-end justify-around px-8 pb-24 pt-5">
            <TouchableOpacity
              className="w-12 h-12 items-center justify-center"
              onPress={() =>
                setFacing((f) => (f === "back" ? "front" : "back"))
              }
            >
              <Text className="text-3xl">🔄</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-20 h-20 rounded-full bg-white items-center justify-center border-4 border-green-400"
              onPress={takePhoto}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#2e7d32" size="large" />
              ) : (
                <View className="w-16 h-16 rounded-full bg-green-500" />
              )}
            </TouchableOpacity>

            <View className="w-12 h-12" />
          </View>
        </View>
      </CameraView>
    </View>
  );
}
