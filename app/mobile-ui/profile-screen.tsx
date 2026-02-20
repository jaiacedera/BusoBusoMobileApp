import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const THEME_BLUE = '#274C77';

const ProfileScreen = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Function to simulate logout with loading state
  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Simulate a 2-second delay for the logout process
    setTimeout(() => {
      setIsLoggingOut(false);
      router.replace('/Mobile UI/UserLogInSignUp' as any);
    }, 2000);
  };

  const menuItems = [
    { id: '1', title: 'Personal Information', icon: 'person' },
    { id: '2', title: 'Notification', icon: 'notifications' },
    { id: '3', title: 'Address', icon: 'location' },
    { id: '4', title: 'Tracker', icon: 'analytics' },
    { id: '5', title: 'Customize', icon: 'create' },
    { id: '6', title: 'Log Out', icon: 'log-out', isLogout: true },
  ];

  const handlePress = (item: any) => {
    if (item.isLogout) {
      handleLogout();
    } else if (item.title === 'Tracker') {
      router.push('/Mobile UI/tracker' as any);
    } else {
      console.log(`Tapped on ${item.title}`);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={() => handlePress(item)}
      activeOpacity={0.6}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={20} color="white" />
      </View>
      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 1. TOP SECTION (Header Background & Avatar) */}
      <View style={styles.headerContainer}>
        <ImageBackground
          source={require('../../assets/images/profile_bg_doodle.png')}
          style={styles.bgImage}
          resizeMode="cover"
        >
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings" size={24} color={THEME_BLUE} />
          </TouchableOpacity>
        </ImageBackground>

        {/* Avatar Stack */}
        <View style={styles.avatarWrapper}>
          <View style={styles.outerCircle}>
            <Image
              source={require('../../assets/images/default_image.jpg')}
              style={styles.avatar}
            />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.userName}>Juan Dela Cruz</Text>

        {/* 2. MENU LIST */}
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace('/mobile-ui/dashboard')}
          >
            <MaterialIcons name="home" size={30} color="rgba(255,255,255,0.54)" />
          </TouchableOpacity>

          <View style={styles.navItemSpace} />

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace('/mobile-ui/profile-screen')}
          >
            <MaterialIcons name="person-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.centerFab} activeOpacity={0.9}>
          <MaterialIcons name="add" size={35} color="white" />
        </TouchableOpacity>
      </View>

      {/* 3. LOGOUT MODAL (Mirroring Flutter Dialog) */}
      <Modal visible={isLoggingOut} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={THEME_BLUE} />
            <Text style={styles.logoutText}>Logging out...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  headerContainer: {
    height: 220,
    width: '100%',
    zIndex: 1,
  },
  bgImage: {
    flex: 1,
    paddingTop: 50,
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  settingsBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -60,
    alignSelf: 'center',
  },
  outerCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  content: {
    flex: 1,
    marginTop: 70,
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME_BLUE,
    marginBottom: 20,
  },
  listPadding: {
    paddingHorizontal: 30,
    paddingBottom: 120,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 320,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME_BLUE,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    justifyContent: 'flex-end',
  },
  bottomNav: {
    backgroundColor: THEME_BLUE,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  navItemSpace: {
    flex: 0.5,
  },
  centerFab: {
    position: 'absolute',
    alignSelf: 'center',
    top: -20,
    backgroundColor: THEME_BLUE,
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#F0F4F8',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: 250,
  },
  logoutText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME_BLUE,
  },
});