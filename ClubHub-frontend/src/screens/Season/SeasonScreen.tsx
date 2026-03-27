import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Trophy, Users, BarChart3, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './Season.styles';
import { SquadScreen } from '../Squad/Squad';
import { Standings } from '../Standings/Standings';
import { SquadStats } from '../Stats/Stats';
import { useSeasons } from '../../contexts/SeasonContext';

type SeasonTab = 'standings' | 'squad' | 'stats';

interface Tab {
  key: SeasonTab;
  label: string;
  icon: any;
}

export function SeasonScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<SeasonTab>('standings');
  const { seasons } = useSeasons();

  //pegar na mais recente, id maior
  const currentSeason = useMemo(() => {
    if (seasons.length === 0) return null;
    return seasons.reduce((latest, season) => season.id > latest.id ? season : latest, seasons[0]);
  }, [seasons]);

  // Tabs configuráveis em array
  const tabs: Tab[] = useMemo(() => [
    { key: 'standings', label: 'Classificação', icon: Trophy },
    { key: 'squad', label: 'Plantel', icon: Users },
    { key: 'stats', label: 'Estatísticas', icon: BarChart3 },
  ], []);

  // Handler memoizado
  const handleTabPress = useCallback((tab: SeasonTab) => {
    setActiveTab(tab);
  }, []);

  // Render do conteúdo da tab
  const renderContent = useMemo(() => {
    switch (activeTab) {
      case 'standings': return <Standings />;
      case 'squad': return <SquadScreen />;
      case 'stats': return <SquadStats />;
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Época {currentSeason?.year}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TabButton
            key={tab.key}
            Icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.key}
            onPress={() => handleTabPress(tab.key)}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent}
      </ScrollView>
    </View>
  );
}

// Componente memoizado de botão de tab
interface TabButtonProps {
  Icon: any;
  label: string;
  active: boolean;
  onPress: () => void;
}

const TabButton = React.memo(({ Icon, label, active, onPress }: TabButtonProps) => (
  <TouchableOpacity
    style={[styles.tab, active && styles.tabActive]}
    onPress={onPress}
  >
    <Icon width={20} height={20} color={active ? '#3b82f6' : '#666'} />
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
  </TouchableOpacity>
));