/**
 * UrgentSummaryCard Component
 * Shows next class and urgent alerts
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type AlertType = {
  label: string;
  type: 'warn' | 'info';
  onPress: () => void;
};

type UrgentSummaryCardProps = {
  nextClassText: string | null;
  alerts: AlertType[];
};

export const UrgentSummaryCard: React.FC<UrgentSummaryCardProps> = ({
  nextClassText,
  alerts,
}) => {
  return (
    <View style={styles.card}>
      {/* Next Class */}
      {nextClassText ? (
        <View style={styles.nextClassContainer}>
          <Text style={styles.nextClassLabel}>Next:</Text>
          <Text style={styles.nextClassText}>{nextClassText}</Text>
        </View>
      ) : (
        <View style={styles.nextClassContainer}>
          <Text style={styles.noClassText}>No more classes today</Text>
        </View>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <View style={styles.alertsContainer}>
          {alerts.map((alert, index) => (
            <Pressable
              key={index}
              style={[
                styles.alertBadge,
                alert.type === 'warn' && styles.alertBadgeWarn,
                alert.type === 'info' && styles.alertBadgeInfo,
              ]}
              onPress={alert.onPress}
              accessibilityLabel={alert.label}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.alertBadgeText,
                  alert.type === 'warn' && styles.alertBadgeTextWarn,
                  alert.type === 'info' && styles.alertBadgeTextInfo,
                ]}
              >
                {alert.type === 'warn' ? '⚠ ' : '📩 '}
                {alert.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  nextClassContainer: {
    marginBottom: 12,
  },
  nextClassLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  nextClassText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 24,
  },
  noClassText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
  },
  alertsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  alertBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    height: 32,
  },
  alertBadgeWarn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  alertBadgeInfo: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  alertBadgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  alertBadgeTextWarn: {
    color: '#92400E',
  },
  alertBadgeTextInfo: {
    color: '#1E40AF',
  },
});
