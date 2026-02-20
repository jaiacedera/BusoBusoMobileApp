import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Assuming you are using React Navigation
import { useNavigation } from '@react-navigation/native';

const THEME_BLUE = '#274C77';
const BG_COLOR = '#F0F4F8';
const { height } = Dimensions.get('window');

// --- Placeholder for Profile Page ---
const ProfilePage = () => (
  <View style={styles.centerContent}>
    <Text style={{ color: 'grey' }}>Profile Page Content</Text>
  </View>
);

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Modal states
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* APP BAR (Only visible on Home) */}
        {currentIndex === 0 && (
          <View style={styles.appBar}>
            <View style={styles.appBarLeft}>
              <Image 
                source={require('../../assets/images/busobuso_logo.png')} 
                style={styles.logoImage} 
                resizeMode="contain"
              />
              <Text style={styles.appBarTitle}>Dashboard</Text>
            </View>
            <TouchableOpacity onPress={() => {}}>
              <MaterialIcons name="search" size={28} color={THEME_BLUE} />
            </TouchableOpacity>
          </View>
        )}

        {/* MAIN CONTENT AREA */}
        <View style={styles.body}>
          {currentIndex === 0 ? <HomeContent /> : <ProfilePage />}
          
          {/* CHATBOT FLOATING BUTTON */}
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
        </View>

        {/* CUSTOM BOTTOM NAVIGATION */}
        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={styles.navItem} 
              onPress={() => setCurrentIndex(0)}
            >
              <MaterialIcons 
                name="home" 
                size={30} 
                color={currentIndex === 0 ? 'white' : 'rgba(255,255,255,0.54)'} 
              />
            </TouchableOpacity>

            {/* Empty space for FAB cutout */}
            <View style={styles.navItemSpace} />

            <TouchableOpacity 
              style={styles.navItem} 
              onPress={() => setCurrentIndex(1)}
            >
              <MaterialIcons 
                name="person-outline" 
                size={30} 
                color={currentIndex === 1 ? 'white' : 'rgba(255,255,255,0.54)'} 
              />
            </TouchableOpacity>
          </View>

          {/* CENTER FAB BUTTON */}
          <TouchableOpacity 
            style={styles.centerFab} 
            onPress={() => setActionMenuVisible(true)}
            activeOpacity={0.9}
          >
            <MaterialIcons name="add" size={35} color="white" />
          </TouchableOpacity>
        </View>

        {/* --- MODALS --- */}

        {/* 1. Action Menu Modal */}
        <Modal visible={actionMenuVisible} transparent animationType="slide">
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setActionMenuVisible(false)}
          >
            <View style={styles.actionMenuContainer}>
              <View style={styles.menuHandle} />
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  setActionMenuVisible(false);
                  navigation.navigate('Reports'); // Replace with your route name
                }}
              >
                <MaterialIcons name="report-problem" size={24} color="red" />
                <Text style={styles.menuItemText}>Incident Report</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  setActionMenuVisible(false);
                  navigation.navigate('CitizenRequest'); // Replace with your route name
                }}
              >
                <MaterialIcons name="people" size={24} color={THEME_BLUE} />
                <Text style={styles.menuItemText}>Citizenss Request</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* 2. Chatbot Modal */}
        <Modal visible={chatbotVisible} transparent animationType="slide">
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
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

      </View>
    </SafeAreaView>
  );
}

// --- HOME CONTENT COMPONENT ---
const HomeContent = () => {
  return (
    <ScrollView contentContainerStyle={styles.homeScrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Emergency News & Updates</Text>
      
      <NewsCard 
        tag="CRITICAL ADVISORY" 
        tagColor="red" 
        title="Taal Volcano: SO2 levels rising..." 
        time="5 mins ago" 
      />
      <NewsCard 
        tag="EMERGENCY ADVISORY" 
        tagColor="orange" 
        title="Heavy Rainfall: Flood Warning..." 
        time="11 hr ago" 
      />

      <View style={{ height: 25 }} />
      <Text style={styles.sectionTitle}>Hazard Map</Text>
      <MapSection />

      <View style={{ height: 25 }} />
      <Text style={styles.sectionTitle}>Nearby Evacuation Centers</Text>
      <EvacuationCard name="1. Barangay Hall" distance="0.5 km away" />
      <EvacuationCard name="2. Buso-Buso Elementary School" distance="1.0 km away" />
      
      {/* Extra padding to prevent bottom nav from hiding content */}
      <View style={{ height: 100 }} /> 
    </ScrollView>
  );
};

// --- REUSABLE UI COMPONENTS ---
const NewsCard = ({ tag, tagColor, title, time }: { tag: string, tagColor: string, title: string, time: string }) => (
  <View style={styles.newsCard}>
    <View style={styles.tagWrapper}>
      <View style={[styles.tag, { backgroundColor: tagColor }]}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
    </View>
    <Text style={styles.newsTitle}>{title}</Text>
    <Text style={styles.newsTime}>{time}</Text>
  </View>
);

const MapSection = () => (
  <View style={styles.mapCard}>
    <Image 
      source={require('../../assets/images/hazard_map.jpg')} 
      style={styles.mapImage} 
      resizeMode="cover" 
    />
    <TouchableOpacity style={styles.mapButton}>
      <MaterialIcons name="map" size={18} color={THEME_BLUE} />
      <Text style={styles.mapButtonText}>View Full Hazard Map</Text>
    </TouchableOpacity>
  </View>
);

const EvacuationCard = ({ name, distance }: { name: string, distance: string }) => (
  <View style={styles.evacCard}>
    <Text style={styles.evacName}>{name}</Text>
    <View style={styles.evacDistanceRow}>
      <MaterialIcons name="directions-walk" size={18} color="green" />
      <Text style={styles.evacDistanceText}>{distance}</Text>
    </View>
  </View>
);

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // Matches AppBar
  },
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // App Bar
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  appBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  appBarTitle: {
    color: THEME_BLUE,
    fontWeight: 'bold',
    fontSize: 22,
  },
  // Body Layout
  body: {
    flex: 1,
    position: 'relative',
  },
  homeScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME_BLUE,
    marginBottom: 12,
  },
  // Chatbot Button
  chatbotFab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 65,
    height: 65,
    zIndex: 100,
  },
  chatbotImage: {
    width: '100%',
    height: '100%',
  },
  // Bottom Nav
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
    flex: 0.5, // Creates the gap for the FAB
  },
  centerFab: {
    position: 'absolute',
    alignSelf: 'center',
    top: -20, // Elevates the FAB above the nav bar
    backgroundColor: THEME_BLUE,
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: BG_COLOR, // Fakes the notch cutout effect
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  // Modals
  modalOverlay: {
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
  actionMenuContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    paddingBottom: 20,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuItemText: {
    fontWeight: 'bold',
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  chatbotContainer: {
    backgroundColor: 'white',
    height: height * 0.7,
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
  // Cards
  newsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  tagWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  tagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  newsTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: THEME_BLUE,
    marginBottom: 8,
  },
  newsTime: {
    alignSelf: 'flex-end',
    color: 'grey',
    fontSize: 11,
  },
  mapCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: 160,
  },
  mapButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  mapButtonText: {
    color: THEME_BLUE,
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 8,
  },
  evacCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  evacName: {
    fontWeight: 'bold',
    color: THEME_BLUE,
    flex: 1,
  },
  evacDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  evacDistanceText: {
    color: 'grey',
    fontSize: 12,
    marginLeft: 4,
  },
});