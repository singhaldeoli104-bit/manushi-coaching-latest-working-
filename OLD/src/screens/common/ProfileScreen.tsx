import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const {theme, toggleTheme, isDark} = useTheme();
  const {user, logout} = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', onPress: logout, style: 'destructive'},
      ]
    );
  };

  const menuItems = [
    {
      title: 'Personal Information',
      icon: 'person',
      onPress: () => console.log('Personal Information'),
    },
    {
      title: 'Notifications',
      icon: 'notifications',
      onPress: () => console.log('Notifications'),
    },
    {
      title: 'Privacy Settings',
      icon: 'privacy-tip',
      onPress: () => console.log('Privacy Settings'),
    },
    {
      title: 'Help & Support',
      icon: 'help',
      onPress: () => console.log('Help & Support'),
    },
  ];

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.background}]}>
      {/* Profile Header */}
      <View style={[styles.profileHeader, {backgroundColor: theme.Surface}]}>
        <View style={[styles.avatar, {backgroundColor: theme.primary}]}>
          <Text style={[styles.avatarText, {color: theme.OnPrimary}]}>
            {user?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.userName, {color: theme.OnSurface}]}>
          {user?.name}
        </Text>
        <Text style={[styles.userRole, {color: theme.OnSurfaceVariant}]}>
          {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
        </Text>
        <Text style={[styles.userEmail, {color: theme.OnSurfaceVariant}]}>
          {user?.email}
        </Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, {backgroundColor: theme.Surface}]}
            onPress={item.onPress}>
            <Icon name={item.icon} size={24} color={theme.OnSurfaceVariant} />
            <Text style={[styles.menuText, {color: theme.OnSurface}]}>
              {item.title}
            </Text>
            <Icon name="arrow-forward-ios" size={16} color={theme.OnSurfaceVariant} />
          </TouchableOpacity>
        ))}

        {/* Theme Toggle */}
        <TouchableOpacity
          style={[styles.menuItem, {backgroundColor: theme.Surface}]}
          onPress={toggleTheme}>
          <Icon 
            name={isDark ? 'light-mode' : 'dark-mode'} 
            size={24} 
            color={theme.OnSurfaceVariant} 
          />
          <Text style={[styles.menuText, {color: theme.OnSurface}]}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Text>
          <Icon name="arrow-forward-ios" size={16} color={theme.OnSurfaceVariant} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.menuItem, {backgroundColor: theme.Surface}]}
          onPress={handleLogout}>
          <Icon name="logout" size={24} color={theme.error} />
          <Text style={[styles.menuText, {color: theme.error}]}>
            Logout
          </Text>
          <Icon name="arrow-forward-ios" size={16} color={theme.error} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
});

export default ProfileScreen;