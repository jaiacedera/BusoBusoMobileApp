import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../services/firebaseconfig';

const THEME_BLUE = '#274C77';

const ReportsScreen = () => {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [report, setReport] = useState('');
  const [isCopyingProfile, setIsCopyingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportId, setReportId] = useState('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Prevent back navigation
    });

    return () => backHandler.remove();
  }, []);

  const handleMicPress = () => {
    Alert.alert(
      'Voice Input',
      'Voice input feature requires rebuilding the app with native modules. For now, please type your report manually.',
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const handleCopyProfile = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert('Profile Error', 'Please log in again to copy your profile data.');
      return;
    }

    try {
      setIsCopyingProfile(true);
      const profileRef = doc(db, 'residents', currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        Alert.alert('Profile Not Found', 'No saved profile data found. Please complete your user form first.');
        return;
      }

      const data = profileSnap.data() as {
        firstName?: string;
        middleInitial?: string;
        lastName?: string;
        address?: string;
        contactNumber?: string;
      };

      const composedName = [
        data.firstName?.trim(),
        data.middleInitial?.trim() ? `${data.middleInitial.trim()}.` : '',
        data.lastName?.trim(),
      ]
        .filter(Boolean)
        .join(' ');

      setFullName(composedName);
      setAddress(data.address?.trim() ?? '');
      setContactNumber(data.contactNumber?.trim() ?? '');
    } catch (error) {
      console.error('Failed to copy profile data:', error);
      Alert.alert('Profile Error', 'Unable to copy profile data right now.');
    } finally {
      setIsCopyingProfile(false);
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !address.trim() || !contactNumber.trim() || !report.trim()) {
      Alert.alert('Missing Fields', 'Please complete all required fields before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);

      const currentUser = auth.currentUser;
      const now = new Date();
      const dateKey = formatDateKey(now);
      const counterRef = doc(db, 'incidentReportCounters', dateKey);

      const sequence = await runTransaction(db, async (transaction) => {
        const counterSnap = await transaction.get(counterRef);
        const lastSequence = counterSnap.exists()
          ? (counterSnap.data().lastSequence as number | undefined) ?? 0
          : 0;
        const nextSequence = lastSequence + 1;

        transaction.set(
          counterRef,
          {
            dateKey,
            lastSequence: nextSequence,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        return nextSequence;
      });

      const generatedReportId = `IR-${dateKey}-${String(sequence).padStart(4, '0')}`;

      await addDoc(collection(db, 'distressReports'), {
        uid: currentUser?.uid ?? null,
        email: currentUser?.email ?? null,
        reportId: generatedReportId,
        dateKey,
        sequence,
        fullName: fullName.trim(),
        address: address.trim(),
        contactNumber: contactNumber.trim(),
        report: report.trim(),
        createdAt: serverTimestamp(),
        status: 'submitted',
      });

      setReportId(generatedReportId);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit report:', error);
      Alert.alert('Submit Error', 'Unable to submit your report right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SUB-COMPONENT: PROGRESS BAR ---
  const ProgressBar = ({ progress }: { progress: 'step2' | 'step3' }) => (
    <View style={styles.progressContainer}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: progress === 'step2' ? '50%' : '100%' }]} />
        {/* Circle Markers */}
        <View style={[styles.dot, { left: 0 }]} />
        <View style={[styles.dot, { left: '50%', marginLeft: -5 }]} />
        <View style={[styles.dot, { right: 0, backgroundColor: progress === 'step3' ? THEME_BLUE : '#D1D5DB' }]} />
      </View>
    </View>
  );

  // --- VIEW 1: THE REPORT FORM ---
  const renderReportForm = () => (
    <ScrollView contentContainerStyle={styles.formScroll}>
      <View style={styles.card}>
        <View style={styles.center}>
          <ProgressBar progress="step2" />
        </View>

        <Text style={styles.sectionTitle}>Personal Information</Text>

        <FormInput
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />
        <FormInput
          label="Address"
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />
        <FormInput
          label="Contact Number"
          placeholder="Enter your contact number"
          value={contactNumber}
          onChangeText={setContactNumber}
        />

        <TouchableOpacity
          style={styles.copyBtn}
          activeOpacity={0.7}
          onPress={handleCopyProfile}
          disabled={isCopyingProfile}
        >
          <Text style={styles.copyBtnText}>{isCopyingProfile ? 'Copying...' : 'Copy Profile'}</Text>
        </TouchableOpacity>

        <FormInput 
          label="Report" 
          placeholder="Enter your report" 
          value={report}
          onChangeText={setReport}
          multiline 
          numberOfLines={6} 
        />

        <View style={styles.footerRow}>
          <TouchableOpacity 
            style={styles.micBtn}
            onPress={handleMicPress}
            activeOpacity={0.7}
          >
            <Ionicons name="mic" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitBtnText}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // --- VIEW 2: THE SUCCESS SCREEN ---
  const renderSuccessScreen = () => (
    <View style={styles.successContainer}>
      <ProgressBar progress="step3" />
      
      <View style={styles.rippleContainer}>
        <View style={[styles.ripple, { width: 180, height: 180, opacity: 0.1 }]} />
        <View style={[styles.ripple, { width: 140, height: 140, opacity: 0.2 }]} />
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={60} color={THEME_BLUE} />
        </View>
      </View>

      <Text style={styles.successTitle}>Report Successful</Text>
      <Text style={styles.successSub}>
        Your incident report has{"\n"}successfully submitted.
      </Text>

      <TouchableOpacity 
        style={styles.idBadge} 
        onPress={() => router.back()}
      >
        <Text style={styles.idText}>Report ID: {reportId}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      
      {/* Custom AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={THEME_BLUE} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Incident Reports</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {isSubmitted ? renderSuccessScreen() : renderReportForm()}
    </KeyboardAvoidingView>
  );
};

// Reusable Input Component
type FormInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
};

const FormInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
}: FormInputProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && { height: 120, textAlignVertical: 'top' }]}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  </View>
);

export default ReportsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  appBarTitle: { fontSize: 18, fontWeight: 'bold', color: THEME_BLUE },
  formScroll: { padding: 20 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  center: { alignItems: 'center', marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: THEME_BLUE, marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  inputLabel: { fontSize: 14, color: THEME_BLUE, marginBottom: 5, fontWeight: '500' },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: THEME_BLUE,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#1F2937',
  },
  copyBtn: {
    alignSelf: 'flex-end',
    backgroundColor: THEME_BLUE,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  copyBtnText: { color: 'white', fontSize: 12 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  micBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micBtnRecording: {
    backgroundColor: '#DC2626',
  },
  recordingText: {
    fontSize: 12,
    color: THEME_BLUE,
    fontStyle: 'italic',
    marginLeft: 8,
  },
  submitBtn: {
    backgroundColor: THEME_BLUE,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  submitBtnText: { color: 'white', fontWeight: 'bold' },
  // Success Screen Styles
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  rippleContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 40 },
  ripple: { position: 'absolute', borderRadius: 100, backgroundColor: THEME_BLUE },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: THEME_BLUE, marginTop: 20 },
  successSub: { fontSize: 16, color: THEME_BLUE, textAlign: 'center', marginTop: 10, lineHeight: 24 },
  idBadge: {
    backgroundColor: THEME_BLUE,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 40,
  },
  idText: { color: 'white', textAlign: 'center', fontWeight: '500' },
  // Progress Bar Helper
  progressContainer: { width: 200, height: 10, justifyContent: 'center' },
  track: { width: '100%', height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 },
  fill: { height: '100%', backgroundColor: THEME_BLUE, borderRadius: 2 },
  dot: {
    position: 'absolute',
    top: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME_BLUE,
  },
});