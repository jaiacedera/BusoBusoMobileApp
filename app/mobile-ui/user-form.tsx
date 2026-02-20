import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveUserProfile } from '../../services/userProfileService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const THEME_BLUE = '#274C77';

const UserForm = () => {
  const router = useRouter();

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleInitial: '',
    address: '',
    contactNumber: '',
    emergencyContact: '',
  });

  // State for errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    let newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Please enter your first name';
    if (!formData.lastName.trim()) newErrors.lastName = 'Please enter your last name';
    if (!formData.address.trim()) newErrors.address = 'Please enter your address';
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Please enter your contact number';
    } else if (formData.contactNumber.length < 11) {
      newErrors.contactNumber = 'Please enter a valid 11-digit number';
    }

    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Please enter emergency contact';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      setIsSaving(true);
      await saveUserProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleInitial: formData.middleInitial.trim(),
        address: formData.address.trim(),
        contactNumber: formData.contactNumber.trim(),
        emergencyContact: formData.emergencyContact.trim(),
      });

      Alert.alert('Success', 'Profile information saved successfully.', [
        { text: 'OK', onPress: () => router.replace('/mobile-ui/dashboard') },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save profile right now.';
      Alert.alert('Save Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderInputLabel = (label: string) => (
    <Text style={styles.inputLabel}>{label}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Custom Header / AppBar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Text style={{ color: THEME_BLUE, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.welcomeText}>Complete your Profile</Text>
          <Text style={styles.subText}>
            This information helps emergency responders locate and assist you faster.
          </Text>

          {/* First Name */}
          {renderInputLabel("First Name")}
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="Enter your first name"
            placeholderTextColor="#FFFFFF99"
            value={formData.firstName}
            onChangeText={(text) => setFormData({...formData, firstName: text})}
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

          {/* Row for Last Name and M.I. */}
          <View style={styles.row}>
            <View style={{ flex: 3 }}>
              {renderInputLabel("Last Name")}
              <TextInput
                style={[styles.input, errors.lastName && styles.inputError]}
                placeholder="Enter last name"
                placeholderTextColor="#FFFFFF99"
                value={formData.lastName}
                onChangeText={(text) => setFormData({...formData, lastName: text})}
              />
              {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            </View>
            
            <View style={{ width: 15 }} />

            <View style={{ flex: 1 }}>
              {renderInputLabel("M.I.")}
              <TextInput
                style={styles.input}
                placeholder="M.I."
                placeholderTextColor="#FFFFFF99"
                value={formData.middleInitial}
                onChangeText={(text) => setFormData({...formData, middleInitial: text})}
                maxLength={2}
              />
            </View>
          </View>

          {/* Address */}
          {renderInputLabel("Complete Address")}
          <TextInput
            style={[styles.input, errors.address && styles.inputError]}
            placeholder="Street, House No., Purok"
            placeholderTextColor="#FFFFFF99"
            value={formData.address}
            onChangeText={(text) => setFormData({...formData, address: text})}
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

          {/* Contact Number */}
          {renderInputLabel("Contact Number")}
          <TextInput
            style={[styles.input, errors.contactNumber && styles.inputError]}
            placeholder="09XXXXXXXXX"
            placeholderTextColor="#FFFFFF99"
            keyboardType="phone-pad"
            value={formData.contactNumber}
            onChangeText={(text) => setFormData({...formData, contactNumber: text})}
          />
          {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}

          {/* Emergency Contact */}
          {renderInputLabel("Emergency Contact Person")}
          <TextInput
            style={[styles.input, errors.emergencyContact && styles.inputError]}
            placeholder="Name of person to contact"
            placeholderTextColor="#FFFFFF99"
            value={formData.emergencyContact}
            onChangeText={(text) => setFormData({...formData, emergencyContact: text})}
          />
          {errors.emergencyContact && <Text style={styles.errorText}>{errors.emergencyContact}</Text>}

          <TouchableOpacity
            style={[styles.button, isSaving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>SAVE AND CONTINUE</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  backButton: {
    paddingRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_BLUE,
  },
  scrollContent: {
    padding: 25,
    paddingBottom: 50,
  },
  welcomeText: {
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
    color: THEME_BLUE,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 30,
  },
  inputLabel: {
    color: THEME_BLUE,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: THEME_BLUE,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: THEME_BLUE,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
