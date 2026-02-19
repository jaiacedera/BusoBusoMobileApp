import { NavigationContainer } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Assuming you have a LoginPage component in login.js
// import LoginPage from './login'; 

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
};

type LandingScreenProp = StackNavigationProp<RootStackParamList, 'Landing'>;

type Props = {
  navigation: LandingScreenProp;
};

const LandingPage: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* 1. BACKGROUND IMAGE */}
      <ImageBackground 
        source={require('../../assets/images/getstarted_background.jpg')} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          
          {/* 2. CIRCULAR LOGO */}
          <View style={styles.logoContainer}>
            <View style={styles.circle}>
              <Image 
                source={require('../../assets/images/busobuso_logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* 3. TITLES */}
          <View style={styles.textContainer}>
            <Text style={styles.mainTitle}>
              {"BARANGAY BUSO-BUSO\nRESIDENT EOC APP"}
            </Text>
            <Text style={styles.subTitle}>
              Your guide to safety and preparedness
            </Text>
          </View>

          {/* 4. GET STARTED BUTTON */}
          <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')} // Matches Stack.Screen name
          >
            <Text style={styles.buttonText}>GET STARTED</Text>
          </TouchableOpacity>

          {/* 5. FOOTER */}
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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingPage} />
        {/* <Stack.Screen name="Login" component={LoginPage} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)', // Subtle tint if needed
  },
  logoContainer: {
    position: 'absolute',
    top: 262,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  circle: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Android Shadow
    shadowColor: '#000', // iOS Shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    padding: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.4883,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mainTitle: {
    fontWeight: '800',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 2.4,
    color: '#F2EFEF',
    textAlign: 'center',
    fontFamily: 'Lato-Bold', // Ensure fonts are linked
  },
  subTitle: {
    fontSize: 13,
    color: '#F2EFEF',
    textAlign: 'center',
    marginTop: 12,
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
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.0493,
    left: 0,
    right: 0,
  },
  footerText: {
    fontSize: 12,
    color: '#F2EFEF',
    textAlign: 'center',
  }
});