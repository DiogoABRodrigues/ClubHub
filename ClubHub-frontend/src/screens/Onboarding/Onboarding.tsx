import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Trophy, Bell, CheckCircle2 } from 'lucide-react-native'; // versão RN
import { Switch } from '../../components/Switch';
import { styles } from './Onboarding.styles';
import { COLORS } from '../../theme/colors';

export const Onboarding: React.FC = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(['Senior']);
  const [notifications, setNotifications] = useState({
    matchStart: true,
    goals: true,
    finalResult: true,
    newsAlerts: false,
  });

  const teams = ['Senior', 'U19', 'U17', 'U15'];

  const toggleTeam = (team: string) => {
    setSelectedTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
    );
  };

  const handleComplete = () => {
    // Save preferences
    // Pode substituir por AsyncStorage em RN
    navigation.navigate('Home' as never);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.progressBar,
              { backgroundColor: i <= step ? COLORS.primary : COLORS.muted },
            ]}
          />
        ))}
      </View>

      {step === 1 && (
        <View style={styles.stepContainer}>
          {/* Logo */}
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🏆</Text>
          </View>
          <Text style={styles.title}>Welcome to FC Titans</Text>
          <Text style={styles.subtitle}>
            Stay connected with your favorite teams and never miss a moment
          </Text>

          {/* Team Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Trophy width={20} height={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Select Your Teams</Text>
            </View>
            <View style={styles.teamGrid}>
              {teams.map((team) => (
                <Pressable
                  key={team}
                  onPress={() => toggleTeam(team)}
                  style={[
                    styles.teamCard,
                    selectedTeams.includes(team)
                      ? { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '33' }
                      : { borderColor: COLORS.muted, backgroundColor: COLORS.surface },
                  ]}
                >
                  <View style={styles.teamCardHeader}>
                    <Text style={styles.teamEmoji}>⚽</Text>
                    {selectedTeams.includes(team) && (
                      <CheckCircle2 width={20} height={20} color={COLORS.primary} />
                    )}
                  </View>
                  <View>
                    <Text style={styles.teamName}>FC Titans</Text>
                    <Text style={styles.teamLevel}>{team}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={() => setStep(2)}
            disabled={selectedTeams.length === 0}
            style={[
              styles.button,
              selectedTeams.length === 0 && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          {/* Icon */}
          <View style={styles.logoCircle}>
            <Bell width={48} height={48} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Stay Updated</Text>
          <Text style={styles.subtitle}>
            Choose which notifications you want to receive
          </Text>

          <View style={styles.section}>
            {Object.entries(notifications).map(([key, value]) => (
              <View key={key} style={styles.notificationCard}>
                <View>
                  <Text style={styles.notificationTitle}>
                    {key === 'matchStart'
                      ? 'Match Start'
                      : key === 'goals'
                      ? 'Goals'
                      : key === 'finalResult'
                      ? 'Final Result'
                      : 'News Alerts'}
                  </Text>
                  <Text style={styles.notificationSubtitle}>
                    {key === 'matchStart'
                      ? 'When a match is about to begin'
                      : key === 'goals'
                      ? 'Instant alerts for every goal'
                      : key === 'finalResult'
                      ? 'When a match finishes'
                      : 'Latest club news and updates'}
                  </Text>
                </View>
                <Switch
                  value={value as boolean}
                  onValueChange={(val) =>
                    setNotifications({ ...notifications, [key]: val })
                  }
                />
              </View>
            ))}
          </View>

          <Pressable onPress={handleComplete} style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>

          <Pressable onPress={() => setStep(1)} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};