import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    BackHandler,
    FlatList,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../../services/firebaseconfig';

const THEME_BLUE = '#274C77';

type ResidentProfile = {
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  address?: string;
  contactNumber?: string;
  emergencyContact?: string;
};

const ProfileScreen = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [displayName, setDisplayName] = useState<string>();
  const [profileData, setProfileData] = useState<ResidentProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Prevent back navigation
    });

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setDisplayName(undefined);
      setProfileData(null);
      setIsProfileLoading(false);
      return;
    }

    const profileRef = doc(db, 'residents', currentUser.uid);

    const unsubscribe = onSnapshot(
      profileRef,
      (profileSnap) => {
        if (!profileSnap.exists()) {
          setDisplayName(undefined);
          setProfileData(null);
          setIsProfileLoading(false);
          return;
        }

        const data = profileSnap.data() as ResidentProfile;

        setProfileData(data);
        setIsProfileLoading(false);

        const fullName = [
          data.firstName?.trim(),
          data.middleInitial?.trim() ? `${data.middleInitial.trim()}.` : '',
          data.lastName?.trim(),
        ]
          .filter(Boolean)
          .join(' ');

        setDisplayName(fullName || undefined);
      },
      (error) => {
        console.error('Failed to listen to profile name:', error);
        setIsProfileLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Function to simulate logout with loading state
  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Simulate a 2-second delay for the logout process
    setTimeout(() => {
      setIsLoggingOut(false);
      router.replace('/mobile-ui/user-log-in-sign-up-screen');
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
    } else if (item.title === 'Personal Information') {
      setShowPersonalInfoModal(true);
    } else if (item.title === 'Tracker') {
      router.push('/mobile-ui/reports-tracker-screen');
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
        <Text style={styles.userName}>{displayName}</Text>

        {/* 2. MENU LIST */}
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity
        style={styles.chatbotFab}
        onPress={() => setChatbotVisible(true)}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../assets/images/pyro_logo.png')}
          style={styles.chatbotImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

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
      <Modal visible={isLoggingOut} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={THEME_BLUE} />
            <Text style={styles.logoutText}>Logging out...</Text>
          </View>
        </View>
      </Modal>

      <Modal visible={chatbotVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatbotOverlay}
        >
          <TouchableOpacity
            style={{ flex: 1, width: '100%' }}
            activeOpacity={1}
            onPress={() => setChatbotVisible(false)}
          />

          <View style={styles.chatbotContainer}>
            <View style={styles.menuHandle} />
            <Text style={styles.chatbotTitle}>Buso-Buso Assistant</Text>
            <View style={styles.divider} />

            <View style={styles.chatbotBody}>
              <Text style={styles.chatbotPlaceholderText}>How can I help you today?</Text>
            </View>

            <View style={styles.chatbotInputContainer}>
              <TextInput
                style={styles.chatbotInput}
                placeholder="Type a message..."
                placeholderTextColor="grey"
              />
              <TouchableOpacity style={styles.sendButton}>
                <MaterialIcons name="send" size={24} color={THEME_BLUE} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showPersonalInfoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPersonalInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.personalInfoModalCard}>
            <Text style={styles.personalInfoTitle}>Personal Information</Text>

            {isProfileLoading ? (
              <ActivityIndicator size="small" color={THEME_BLUE} />
            ) : !profileData ? (
              <Text style={styles.emptyInfoText}>No saved personal information found.</Text>
            ) : (
              <View style={styles.personalInfoList}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>First Name</Text>
                  <Text style={styles.infoValue}>{profileData.firstName || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Last Name</Text>
                  <Text style={styles.infoValue}>{profileData.lastName || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Middle Initial</Text>
                  <Text style={styles.infoValue}>{profileData.middleInitial || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{profileData.address || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Contact Number</Text>
                  <Text style={styles.infoValue}>{profileData.contactNumber || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Emergency Contact</Text>
                  <Text style={styles.infoValue}>{profileData.emergencyContact || '-'}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeInfoButton}
              onPress={() => setShowPersonalInfoModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeInfoButtonText}>Close</Text>
            </TouchableOpacity>
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
  chatbotFab: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    width: 65,
    height: 65,
    zIndex: 100,
  },
  chatbotImage: {
    width: '100%',
    height: '100%',
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
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  personalInfoModalCard: {
    width: '88%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
  },
  personalInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_BLUE,
    marginBottom: 12,
  },
  personalInfoList: {
    gap: 8,
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyInfoText: {
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  closeInfoButton: {
    marginTop: 16,
    backgroundColor: THEME_BLUE,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeInfoButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chatbotOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  chatbotContainer: {
    backgroundColor: 'white',
    height: '70%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  chatbotTitle: {
    color: THEME_BLUE,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 20,
    paddingTop: 10,
  },
  chatbotBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatbotPlaceholderText: {
    color: 'grey',
  },
  chatbotInputContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  chatbotInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    color: 'black',
  },
  sendButton: {
    padding: 10,
  },
});