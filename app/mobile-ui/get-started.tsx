import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GetStartedScreen = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace('/mobile-ui/user-log-in-sign-up-screen');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImageBackground 
        source={require('../../assets/images/getstarted_background.jpg')} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          
          {/* Vertical Spacer to push content down */}
          <View style={{ flex: 1.5 }} /> 

          <View style={styles.mainContent}>
            {/* LOGO CONTAINER */}
            <View style={styles.circle}>
              <Image 
                source={require('../../assets/images/busobuso_logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.mainTitle}>
                {"BARANGAY BUSO-BUSO\nRESIDENT EOC APP"}
              </Text>
              <Text style={styles.subTitle}>
                Your guide to safety and preparedness
              </Text>
            </View>
          </View>

          {/* Bottom Spacer */}
          <View style={{ flex: 1 }} /> 

          <View style={styles.bottomSection}>
            <TouchableOpacity 
              style={styles.button}
              activeOpacity={0.8}
              onPress={handleGetStarted}
            >
              <Text style={styles.buttonText}>GET STARTED</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Stay informed. Stay safe. © 2025 All rights reserved.
            </Text>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  background: { 
    flex: 1 
  },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    alignItems: 'center',
    paddingBottom: SCREEN_HEIGHT * 0.05,
  },
  mainContent: {
    alignItems: 'center',
    width: '100%',
  },
  circle: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    // Math fix: Radius must be exactly half of width/height
    borderRadius: (SCREEN_WIDTH * 0.5) / 2, 
    backgroundColor: 'white',
    justifyContent: 'center', 
    alignItems: 'center', 
    // Ensure the container truly clips its children to the rounded shape on Android
    overflow: 'hidden',
    // Keep 1:1 aspect ratio as a safeguard
    aspectRatio: 1,
    elevation: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5, 
    marginBottom: 20,
  },
  logoImage: { 
    // 85% gives the logo a small white border inside the circle
    width: '100%', 
    height: '100%' 
  },
  textContainer: { 
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainTitle: { 
    fontWeight: '900', 
    fontSize: SCREEN_WIDTH * 0.065, 
    color: '#FFFFFF', 
    textAlign: 'center',
    lineHeight: SCREEN_WIDTH * 0.085,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subTitle: { 
    fontSize: SCREEN_WIDTH * 0.04, 
    color: '#F2EFEF', 
    textAlign: 'center', 
    marginTop: 8,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    // Smaller responsive width
    width: SCREEN_WIDTH * 0.6, 
    height: 50,
    backgroundColor: 'white', 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },
  buttonText: { 
    color: '#274C77', 
    fontWeight: '900', 
    fontSize: 16,
  },
  footerText: { 
    fontSize: 11, 
    color: '#FFFFFF', 
    textAlign: 'center',
    opacity: 0.8 
  }
});