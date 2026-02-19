import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
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
import { signInUser, signUpUser } from '../services/authservice';

export default function UserLogInSignUp() {
  const router = useRouter(); 
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTabToggle = (toLogin: boolean) => {
    setIsLogin(toLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const user = await signInUser(email, password);
        if (user) {
          // Navigate to Dashboard on successful login
          router.push('/Mobile UI/Dashboard' as any);
        }
      } else {
        // --- SIGNUP LOGIC ---
        const user = await signUpUser(email, password);
        if (user) {
          // Navigate to UserForm on successful signup
          router.push('/Mobile UI/UserForm' as any);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. Background Layer */}
      <View style={StyleSheet.absoluteFill}>
        <Image
          source={require('../../assets/images/getstarted_background.jpg')}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[
            'rgba(72, 141, 221, 0)',
            'rgba(56, 109, 170, 0.5)',
            'rgba(39, 76, 119, 0.96)',
          ]}
          locations={[0, 0.0001, 0.5385]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* 2. Top Header Section */}
          <View style={styles.headerShadowContainer}>
            <View style={styles.headerContainer}>
              <View style={[StyleSheet.absoluteFill, { borderRadius: 50, overflow: 'hidden' }]}>
                <LinearGradient
                  colors={[
                    'rgba(72, 141, 221, 0)',
                    'rgba(56, 109, 170, 0.5)',
                    'rgba(39, 76, 119, 0.96)',
                  ]}
                  style={StyleSheet.absoluteFill}
                />
              </View>

              <View style={styles.logoWrapper}>
                <View style={styles.logoCircle}>
                  <Image
                    source={require('../../assets/images/busobuso_logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <Text style={styles.appTitle}>
                Barangay Buso-Buso{'\n'}Resident EOC App
              </Text>

              <View style={styles.tabBarContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleTabToggle(true)}
                  style={styles.tabItem}
                >
                  <Text style={[styles.tabText, isLogin && styles.activeTabText]}>Login</Text>
                  {isLogin && <View style={styles.activeIndicator} />}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleTabToggle(false)}
                  style={styles.tabItem}
                >
                  <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>Signup</Text>
                  {!isLogin && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 3. Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email address</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                cursorColor="#FFF"
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>

            <View style={[styles.inputGroup, { marginTop: 25 }]}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  cursorColor="#FFF"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {!isLogin && (
              <View style={[styles.inputGroup, { marginTop: 25 }]}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    cursorColor="#FFF"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <MaterialIcons
                      name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="rgba(255, 255, 255, 0.7)"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Submit Button handles both Login and Signup navigation after auth */}
            <TouchableOpacity 
              style={[styles.mainBtn, { marginTop: isLogin ? 40 : 30 }]}
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#274C77" />
              ) : (
                <Text style={styles.mainBtnText}>
                  {isLogin ? 'LOGIN' : 'SIGN UP'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.googleBtn}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.png' }}
                style={styles.googleIcon}
              />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Stay informed. Stay safe. © 2025 All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1E3A5F' 
  },
  scrollContent: { 
    flexGrow: 1 
  },
  headerShadowContainer: {
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 10,
  },
  headerContainer: {
    backgroundColor: '#274C77',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderWidth: 0.5,
    borderColor: '#000000',
    paddingTop: 85,
    paddingBottom: 0,
    alignItems: 'center',
  },
  logoWrapper: { 
    marginBottom: 25 
  },
  logoCircle: {
    width: 130, 
    height: 130,
    backgroundColor: '#FFF', 
    borderRadius: 65,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  logoImage: { 
    width: '85%', 
    height: '85%' 
  },
  appTitle: {
    color: '#FFF', 
    fontSize: 20, 
    fontWeight: '800', 
    textAlign: 'center',
    lineHeight: 24, 
    letterSpacing: 2.4, 
    marginBottom: 40,
  },
  tabBarContainer: {
    flexDirection: 'row', 
    width: '100%', 
    height: 60,
    paddingHorizontal: 60, 
    justifyContent: 'space-between',
  },
  tabItem: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'relative' 
  },
  tabText: { 
    fontSize: 17, 
    color: 'rgba(242, 239, 239, 0.7)', 
    fontWeight: '700', 
    paddingBottom: 5 
  },
  activeTabText: { 
    color: '#F2EFEF' 
  },
  activeIndicator: { 
    position: 'absolute', 
    bottom: 0, 
    width: 82, 
    height: 3, 
    backgroundColor: '#FFFFFF' 
  },
  formContainer: { 
    paddingHorizontal: 53, 
    paddingTop: 20, 
    paddingBottom: 130 
  },
  inputGroup: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#FFFFFF', 
    paddingBottom: 8 
  },
  inputLabel: { 
    color: 'rgba(255, 255, 255, 0.67)', 
    fontSize: 13, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  textInput: { 
    color: '#FFF', 
    fontSize: 16, 
    paddingVertical: 4 
  },
  passwordRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  mainBtn: { 
    backgroundColor: '#FFF', 
    borderRadius: 33, 
    height: 42, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  mainBtnText: { 
    color: '#274C77', 
    fontWeight: '700', 
    fontSize: 14 
  },
  dividerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 25 
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#FFFFFF' 
  },
  orText: { 
    color: '#FFF', 
    paddingHorizontal: 15, 
    fontSize: 13, 
    fontWeight: '600' 
  },
  googleBtn: { 
    backgroundColor: '#FFF', 
    borderRadius: 41, 
    height: 42, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  googleIcon: { 
    width: 20, 
    height: 20, 
    marginRight: 12 
  },
  googleBtnText: { 
    color: '#274C77', 
    fontWeight: '700', 
    fontSize: 14 
  },
  footer: { 
    position: 'absolute', 
    bottom: 25, 
    width: '100%', 
    alignItems: 'center' 
  },
  footerText: { 
    color: '#F2EFEF', 
    fontSize: 13, 
    letterSpacing: 0.65 
  },
});