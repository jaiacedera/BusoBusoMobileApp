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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const GetStartedScreen = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/mobile-ui/user-log-in-sign-up-screen');
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
          
          <View style={styles.logoContainer}>
            <View style={styles.circle}>
              <Image 
                source={require('../../assets/images/busobuso_logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.mainTitle}>
              {"BARANGAY BUSO-BUSO\nRESIDENT EOC APP"}
            </Text>
            <Text style={styles.subTitle}>
              Your guide to safety and preparedness
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>GET STARTED</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
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
    backgroundColor: 'rgba(0,0,0,0.1)' 
  },
  logoContainer: { 
    position: 'absolute', 
    top: 262, 
    left: 0, 
    right: 0, 
    alignItems: 'center' 
  },
  circle: {
    width: 136, 
    height: 136, 
    borderRadius: 68, 
    backgroundColor: 'white',
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    padding: 8,
  },
  logoImage: { 
    width: '100%', 
    height: '100%' 
  },
  textContainer: { 
    position: 'absolute', 
    top: SCREEN_HEIGHT * 0.4883, 
    left: 0, 
    right: 0, 
    alignItems: 'center' 
  },
  mainTitle: { 
    fontWeight: '800', 
    fontSize: 20, 
    color: '#F2EFEF', 
    textAlign: 'center' 
  },
  subTitle: { 
    fontSize: 13, 
    color: '#F2EFEF', 
    textAlign: 'center', 
    marginTop: 12 
  },
  button: {
    position: 'absolute', 
    bottom: 100, 
    left: 54, 
    right: 54, 
    height: 45,
    backgroundColor: 'white', 
    borderRadius: 33, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  buttonText: { 
    color: '#274C77', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  footer: { 
    position: 'absolute', 
    bottom: SCREEN_HEIGHT * 0.0493, 
    left: 0, 
    right: 0 
  },
  footerText: { 
    fontSize: 12, 
    color: '#F2EFEF', 
    textAlign: 'center' 
  }
});