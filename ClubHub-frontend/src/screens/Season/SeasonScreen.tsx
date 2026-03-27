// SeasonScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Trophy, Users, BarChart3 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './Season.styles';
import { SquadScreen } from '../Squad/Squad';
import { Standings } from '../Standings/Standings';
import { ArrowLeft } from 'lucide-react-native';
import { SquadStats } from '../Stats/Stats';

type SeasonTab = 'standings' | 'squad' | 'stats';

export function SeasonScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<SeasonTab>('standings');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Época 2024/25</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TabButton
          icon={Trophy}
          label="Classificação"
          active={activeTab === 'standings'}
          onPress={() => setActiveTab('standings')}
        />
        <TabButton
          icon={Users}
          label="Plantel"
          active={activeTab === 'squad'}
          onPress={() => setActiveTab('squad')}
        />
        <TabButton
          icon={BarChart3}
          label="Estatísticas"
          active={activeTab === 'stats'}
          onPress={() => setActiveTab('stats')}
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'standings' && <Standings />}
        {activeTab === 'squad' && <SquadScreen />}
        {activeTab === 'stats' && <SquadStats />}
      </ScrollView>
    </View>
  );
}

// Componente de botão de tab
const TabButton = ({ icon: Icon, label, active, onPress }: any) => (
  <TouchableOpacity
    style={[styles.tab, active && styles.tabActive]}
    onPress={onPress}
  >
    <Icon width={20} height={20} color={active ? '#3b82f6' : '#666'} />
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
  </TouchableOpacity>
);