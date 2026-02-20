import { useRouter } from 'expo-router'; //
import React, { useState } from 'react';
import {
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

const THEME_BLUE = '#274C77';

const UserForm = () => {
  const router = useRouter(); //

  // Form State
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Error State for Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!address.trim()) newErrors.address = 'Please enter your address';
    
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Please enter your contact number';
    } else if (contactNumber.length < 11) {
      newErrors.contactNumber = 'Please enter a valid 11-digit number';
    }

    if (!emergencyContact.trim()) {
      newErrors.emergencyContact = 'Please enter an emergency contact name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Use push for navigation to Dashboard
      router.push('/Mobile UI/Dashboard' as any);
    }
  };

  // Reusable Input Component to mirror Flutter's _buildTextFormField
  const FormInput = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    isNumber = false, 
    errorKey 
  }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[errorKey] ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        value={value}
        onChangeText={onChangeText}
        keyboardType={isNumber ? 'phone-pad' : 'default'}
        cursorColor="white"
      />
      {errors[errorKey] && <Text style={styles.errorText}>{errors[errorKey]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Personal Information</Text>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Complete your Profile</Text>
          <Text style={styles.subTitle}>
            This information helps emergency responders locate and assist you faster.
          </Text>
        </View>

        {/* Form Fields */}
        <FormInput
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
          errorKey="fullName"
        />

        <FormInput
          label="Complete Address"
          placeholder="Street, House No., Purok"
          value={address}
          onChangeText={setAddress}
          errorKey="address"
        />

        <FormInput
          label="Contact Number"
          placeholder="09XXXXXXXXX"
          value={contactNumber}
          onChangeText={setContactNumber}
          isNumber={true}
          errorKey="contactNumber"
        />

        <FormInput
          label="Emergency Contact Person"
          placeholder="Name of person to contact"
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          errorKey="emergencyContact"
        />

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>SAVE AND CONTINUE</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 25,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_BLUE,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME_BLUE,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: THEME_BLUE,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: THEME_BLUE,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 14,
  },
  inputError: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: THEME_BLUE,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});