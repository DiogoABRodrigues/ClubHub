import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Switch } from '../../components/Switch';
import { styles } from './NotificationSettings.styles';
import { COLORS } from '../../theme/colors';

export const NotificationSettings = ({ navigation }: any) => {
  const [preferences, setPreferences] = useState({
    matchStart: true,
    goals: true,
    finalResult: true,
    newsAlerts: false,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationTypes = [
    { key: 'matchStart' as const, icon: 'trophy-outline', title: 'Match Start', description: 'Get notified when a match is about to begin', color: COLORS.primary },
    { key: 'goals' as const, icon: 'rocket-outline', title: 'Goals', description: 'Receive instant alerts when your team scores', color: COLORS.chart2 },
    { key: 'finalResult' as const, icon: 'checkmark-done-outline', title: 'Final Result', description: 'Get notified when a match finishes', color: COLORS.chart3 },
    { key: 'newsAlerts' as const, icon: 'newspaper-outline', title: 'News Alerts', description: 'Stay updated with the latest club news', color: COLORS.chart3 },
  ];

  const teamPreferences = [
    { title: 'Senior Team', subtitle: 'All notifications enabled', enabled: true },
    { title: 'U19 Team', subtitle: 'All notifications enabled', enabled: true },
    { title: 'U17 Team', subtitle: 'All notifications disabled', enabled: false },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification Settings</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="notifications-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Stay Connected</Text>
            <Text style={styles.infoDescription}>
              Choose which notifications you want to receive to stay up to date with FC Titans.
            </Text>
          </View>
        </View>

        {/* Notification Toggles */}
        <View style={styles.section}>
          {notificationTypes.map(({ key, icon, title, description, color }) => (
            <View key={key} style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
                  <Ionicons name={icon as any} size={20} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleTitle}>{title}</Text>
                  <Text style={styles.toggleDescription}>{description}</Text>
                </View>
              </View>
              <Switch
                value={preferences[key]}
                onValueChange={() => togglePreference(key)}
              />
            </View>
          ))}
        </View>

        {/* Team Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Preferences</Text>
          <View style={styles.teamCard}>
            {teamPreferences.map((team) => (
              <View key={team.title} style={styles.teamRow}>
                <View>
                  <Text style={styles.teamTitle}>{team.title}</Text>
                  <Text style={styles.teamSubtitle}>{team.subtitle}</Text>
                </View>
                <Switch value={team.enabled} onValueChange={() => {}} />
              </View>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};