/**
 * NewStudyLibraryScreen - Premium Minimal Design
 * Purpose: Display study materials and resources library
 * Used in: StudentNavigator (AssignmentsStack)
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Linking, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseScreen } from '../../shared/components/BaseScreen';
import { Card } from '../../ui/surfaces/Card';
import { T } from '../../ui';
import { trackAction, trackScreenView } from '../../utils/navigationAnalytics';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

type Props = NativeStackScreenProps<any, 'NewStudyLibraryScreen'>;

interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'video' | 'document' | 'link';
  file_url?: string;
  description?: string;
  created_at: string;
}

export default function NewStudyLibraryScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Track screen view
  React.useEffect(() => {
    trackScreenView('NewStudyLibraryScreen');
  }, []);

  // Fetch study materials
  const { data: materials, isLoading, error, refetch } = useQuery({
    queryKey: ['study-materials', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as StudyMaterial[];
    },
    enabled: !!user?.id,
  });

  // Get unique subjects
  const subjects = React.useMemo(() => {
    if (!materials) return ['All'];
    const uniqueSubjects = Array.from(new Set(materials.map(m => m.subject)));
    return ['All', ...uniqueSubjects];
  }, [materials]);

  // Filter materials by subject
  const filteredMaterials = React.useMemo(() => {
    if (!materials) return [];
    if (selectedSubject === 'All') return materials;
    return materials.filter(m => m.subject === selectedSubject);
  }, [materials, selectedSubject]);

  // Get material icon
  const getMaterialIcon = (type: string): string => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'video':
        return '🎥';
      case 'link':
        return '🔗';
      default:
        return '📝';
    }
  };

  // Handle material press
  const handleMaterialPress = useCallback(async (material: StudyMaterial) => {
    if (!material.file_url) {
      Alert.alert('No File', 'This material does not have a file attached.');
      return;
    }

    trackAction('open_study_material', 'NewStudyLibraryScreen', {
      materialId: material.id,
      type: material.type,
    });

    try {
      const supported = await Linking.canOpenURL(material.file_url);
      if (supported) {
        await Linking.openURL(material.file_url);
      } else {
        Alert.alert('Error', 'Unable to open this file.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to open file.');
    }
  }, []);

  // Render material item
  const renderMaterial = ({ item }: { item: StudyMaterial }) => (
    <TouchableOpacity
      style={styles.materialCard}
      onPress={() => handleMaterialPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.title}`}
    >
      <View style={styles.materialIcon}>
        <T variant="h3">{getMaterialIcon(item.type)}</T>
      </View>
      <View style={styles.materialInfo}>
        <T variant="body" weight="semiBold" numberOfLines={2}>
          {item.title}
        </T>
        <T variant="caption" style={styles.materialSubject}>
          {item.subject}
        </T>
        {item.description && (
          <T variant="caption" style={styles.materialDescription} numberOfLines={2}>
            {item.description}
          </T>
        )}
        <T variant="caption" style={styles.materialDate}>
          {new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </T>
      </View>
      <T variant="body" style={styles.materialArrow}>
        →
      </T>
    </TouchableOpacity>
  );

  return (
    <BaseScreen
      scrollable={false}
      loading={isLoading}
      error={error ? 'Failed to load study materials' : null}
      empty={!materials || materials.length === 0}
      emptyMessage="No study materials available"
    >
      <View style={styles.container}>
        {/* Subject Filter */}
        <View style={styles.filterContainer}>
          <T variant="body" weight="semiBold" style={styles.filterLabel}>
            Subject:
          </T>
          <FlatList
            horizontal
            data={subjects}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedSubject === item && styles.filterChipActive,
                ]}
                onPress={() => {
                  setSelectedSubject(item);
                  trackAction('filter_subject', 'NewStudyLibraryScreen', { subject: item });
                }}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${item}`}
              >
                <T
                  variant="body"
                  weight="semiBold"
                  style={[
                    styles.filterChipText,
                    selectedSubject === item && styles.filterChipTextActive,
                  ]}
                >
                  {item}
                </T>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Materials List */}
        <FlatList
          data={filteredMaterials}
          keyExtractor={(item) => item.id}
          renderItem={renderMaterial}
          contentContainerStyle={styles.materialsList}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            trackAction('refresh_library', 'NewStudyLibraryScreen');
            refetch();
          }}
          refreshing={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <T variant="body" style={styles.emptyText}>
                {selectedSubject === 'All'
                  ? 'No study materials available'
                  : `No materials for ${selectedSubject}`}
              </T>
            </View>
          }
        />
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterLabel: {
    marginBottom: 8,
  },
  filterList: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  materialsList: {
    padding: 16,
    gap: 12,
  },
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  materialIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  materialInfo: {
    flex: 1,
    gap: 4,
  },
  materialSubject: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  materialDescription: {
    color: '#6B7280',
  },
  materialDate: {
    color: '#9CA3AF',
  },
  materialArrow: {
    color: '#9CA3AF',
    fontSize: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});
