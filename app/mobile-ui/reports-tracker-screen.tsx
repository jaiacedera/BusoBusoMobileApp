import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../services/firebaseconfig';

const THEME_BLUE = '#274C77';

type TrackedReport = {
  id: string;
  reportId: string;
  report: string;
  status: string;
  createdAt: string;
  createdAtMillis: number;
};

const ReportTrackerScreen = () => {
  const router = useRouter();
  const [reports, setReports] = useState<TrackedReport[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Prevent back navigation
    });

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setReports([]);
      setIsLoadingReports(false);
      return;
    }

    const reportsRef = collection(db, 'distressReports');
    const reportsQuery = query(
      reportsRef,
      where('uid', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot) => {
        const mappedReports = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as {
            reportId?: string;
            report?: string;
            status?: string;
            createdAt?: { toDate?: () => Date };
          };

          const createdAtDate = data.createdAt?.toDate?.();
          const createdAt = createdAtDate
            ? createdAtDate.toLocaleDateString()
            : 'No date';
          const createdAtMillis = createdAtDate?.getTime() ?? 0;

          return {
            id: docSnap.id,
            reportId: data.reportId ?? 'No Report ID',
            report: data.report ?? '',
            status: data.status ?? 'submitted',
            createdAt,
            createdAtMillis,
          };
        });

        mappedReports.sort((a, b) => b.createdAtMillis - a.createdAtMillis);
        setReports(mappedReports);
        setIsLoadingReports(false);
      },
      (error) => {
        console.error('Failed to load reports:', error);
        setReports([]);
        setIsLoadingReports(false);
      }
    );

    return unsubscribe;
  }, []);

  const filteredReports = reports.filter((item) => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return true;

    return (
      item.reportId.toLowerCase().includes(keyword) ||
      item.report.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword) ||
      item.createdAt.toLowerCase().includes(keyword)
    );
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Custom AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={THEME_BLUE} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Tracking</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Report Tracking</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search your reports"
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
          />

          {isLoadingReports ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={THEME_BLUE} />
              <Text style={styles.loadingText}>Loading reports...</Text>
            </View>
          ) : filteredReports.length === 0 ? (
            <Text style={styles.placeholderText}>No matching reports found.</Text>
          ) : (
            filteredReports.map((item) => (
              <View key={item.id} style={styles.reportCard}>
                <View style={styles.reportTopRow}>
                  <Text style={styles.reportIdText}>{item.reportId}</Text>
                  <Text style={styles.reportStatusText}>{item.status}</Text>
                </View>
                <Text style={styles.reportDateText}>{item.createdAt}</Text>
                <Text style={styles.reportBodyText} numberOfLines={2}>
                  {item.report || 'No report details'}
                </Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
};

export default ReportTrackerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_BLUE,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
  },
  sectionTitle: {
    color: THEME_BLUE,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#1F2937',
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#64748B',
  },
  reportCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  reportTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportIdText: {
    color: THEME_BLUE,
    fontWeight: '700',
    fontSize: 13,
  },
  reportStatusText: {
    color: '#475569',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  reportDateText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  reportBodyText: {
    color: '#334155',
    fontSize: 13,
    marginTop: 6,
  },
  placeholderText: {
    color: '#64748B',
    fontStyle: 'italic',
  }
});