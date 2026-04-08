import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth-context";
import api from "@/constants/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password)
      return Alert.alert("Error", "Please fill all fields");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      await login(data.token, data.user);
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1 bg-green-900 p-4"
        keyboardShouldPersistTaps="handled"
      >
        {/* Top */}
        <View className="items-center pt-16 pb-8">
          <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center mb-4">
            <Text className="text-5xl">♻️</Text>
          </View>
          <Text className="text-4xl font-bold text-white tracking-wide">
            EcoWaste
          </Text>
          <Text className="text-white/70 text-sm mt-2">
            Scan. Classify. Dispose Responsibly.
          </Text>
        </View>

        {/* Card */}
        <View className="bg-white rounded-3xl px-7 pt-8 pb-10 flex-1">
          <Text className="text-2xl font-bold text-green-900 mb-1">
            Welcome Back 👋
          </Text>
          <Text className="text-gray-400 text-sm mb-6">
            Login to your account
          </Text>

          {/* Email */}
          <Text className="text-sm font-semibold text-gray-600 mb-2">
            Email
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-4 border border-gray-200">
            <Text className="text-lg mr-2">📧</Text>
            <TextInput
              className="flex-1 py-4 text-base text-gray-800"
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <Text className="text-sm font-semibold text-gray-600 mb-2">
            Password
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-6 border border-gray-200">
            <Text className="text-lg mr-2">🔒</Text>
            <TextInput
              className="flex-1 py-4 text-base text-gray-800"
              placeholder="Enter your password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text className="text-lg">{showPassword ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-green-800 py-4 rounded-2xl items-center mb-5"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">Login</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center mb-5">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-3 text-gray-400 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          <TouchableOpacity
            className="border-2 border-green-800 py-4 rounded-2xl items-center"
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text className="text-green-800 text-base font-bold">
              Create New Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
