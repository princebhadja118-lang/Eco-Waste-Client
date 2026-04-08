import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
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
      <View style={styles.container}>
        <Text style={styles.message}>Camera permission chahiye</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionText}>Permission Do</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.3,
        imageType: "jpg",
        skipProcessing: true,
      });

      // Remove data URI prefix if present, send raw base64
      const raw = photo.base64.replace(/^data:image\/\w+;base64,/, '').trim();

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
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
          >
            <Text style={styles.flipText}>🔄</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePhoto}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#2e7d32" />
            ) : (
              <View style={styles.captureInner} />
            )}
          </TouchableOpacity>

          <View style={{ flex: 1 }} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#000" },
  message: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 40,
    alignItems: "center",
  },
  permissionText: { color: "#fff", fontWeight: "bold" },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 30,
  },
  flipButton: { flex: 1, alignItems: "center" },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#ccc",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  flipText: { fontSize: 28 },
});
