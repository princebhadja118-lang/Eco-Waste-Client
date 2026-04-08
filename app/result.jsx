import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

const CATEGORY_ICONS = {
  plastic: '🧴', organic: '🌿', metal: '🔩',
  glass: '🪟', electronic: '📱', hazardous: '☣️',
  paper: '📄', unknown: '🗑️',
};

const CATEGORY_BG = {
  plastic: '#1565c0', organic: '#2e7d32', metal: '#6d4c41',
  glass: '#00838f', electronic: '#6a1b9a', hazardous: '#c62828',
  paper: '#f57c00', unknown: '#555',
};

const HAZARD_COLORS = { low: '#2e7d32', medium: '#f57c00', high: '#c62828' };

export default function ResultScreen() {
  const { result } = useLocalSearchParams();
  const router = useRouter();
  const data = JSON.parse(result);

  const bgColor = CATEGORY_BG[data.wasteCategory] || '#555';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <View style={[styles.hero, { backgroundColor: bgColor }]}>
          <Text style={styles.heroIcon}>{CATEGORY_ICONS[data.wasteCategory] || '🗑️'}</Text>
          <Text style={styles.itemName}>{data.itemName}</Text>
          <Text style={styles.categoryLabel}>{data.wasteCategory?.toUpperCase()}</Text>

          {/* Badges */}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: data.isRecyclable ? '#4caf50' : '#ef5350' }]}>
              <Text style={styles.badgeText}>{data.isRecyclable ? '♻️ Recyclable' : '🚫 Not Recyclable'}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: HAZARD_COLORS[data.hazardLevel] || '#666' }]}>
              <Text style={styles.badgeText}>⚠️ {data.hazardLevel?.toUpperCase()} Risk</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>

          {/* Disposal Tip */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🗑️</Text>
              <Text style={styles.cardTitle}>How to Dispose</Text>
            </View>
            <Text style={styles.cardText}>{data.disposalTip}</Text>
          </View>

          {/* Environmental Impact */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🌍</Text>
              <Text style={styles.cardTitle}>Environmental Impact</Text>
            </View>
            <Text style={styles.cardText}>{data.environmentalImpact}</Text>
          </View>

          {/* Quick Info */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>📦</Text>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{data.wasteCategory}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>♻️</Text>
              <Text style={styles.infoLabel}>Recyclable</Text>
              <Text style={styles.infoValue}>{data.isRecyclable ? 'Yes' : 'No'}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>⚠️</Text>
              <Text style={styles.infoLabel}>Hazard</Text>
              <Text style={styles.infoValue}>{data.hazardLevel}</Text>
            </View>
          </View>

          {/* Scan Again Button */}
          <TouchableOpacity style={[styles.button, { backgroundColor: bgColor }]} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.buttonText}>📷  Scan Again</Text>
          </TouchableOpacity>

          {/* History Button */}
          <TouchableOpacity style={styles.outlineButton} onPress={() => router.replace('/(tabs)/history')}>
            <Text style={[styles.outlineButtonText, { color: bgColor }]}>View History</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4f0' },

  // Hero
  hero: { alignItems: 'center', paddingTop: 40, paddingBottom: 32, paddingHorizontal: 24 },
  heroIcon: { fontSize: 80, marginBottom: 12 },
  itemName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4, textAlign: 'center' },
  categoryLabel: { fontSize: 13, color: 'rgba(255,255,255,0.75)', letterSpacing: 2, marginBottom: 16 },
  badgeRow: { flexDirection: 'row', gap: 10 },
  badge: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  // Body
  body: { padding: 16 },

  // Cards
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardIcon: { fontSize: 20, marginRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardText: { fontSize: 14, color: '#555', lineHeight: 22 },

  // Info Row
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  infoBox: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', marginHorizontal: 4, elevation: 2 },
  infoIcon: { fontSize: 22, marginBottom: 6 },
  infoLabel: { fontSize: 11, color: '#aaa', marginBottom: 4 },
  infoValue: { fontSize: 13, fontWeight: 'bold', color: '#333', textTransform: 'capitalize' },

  // Buttons
  button: { padding: 16, borderRadius: 14, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  outlineButton: { padding: 16, borderRadius: 14, alignItems: 'center', borderWidth: 2, borderColor: '#ddd', marginBottom: 20 },
  outlineButtonText: { fontSize: 15, fontWeight: 'bold' },
});
