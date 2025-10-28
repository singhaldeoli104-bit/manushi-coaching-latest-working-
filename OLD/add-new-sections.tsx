        {/* NEW SECTION 2A: Performance Trend & Attendance */}
        {(performanceTrend || progress) && (
          <Card variant="elevated">
            <CardContent>
              <Row spaceBetween centerV style={{ marginBottom: Spacing.md }}>
                <T variant="body" weight="semiBold">Performance Insights</T>
                {performanceTrend && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                    <T variant="caption" style={{ color:
                      performanceTrend.trendDirection === 'improving' ? Colors.success :
                      performanceTrend.trendDirection === 'declining' ? Colors.error :
                      Colors.warning
                    }}>
                      {performanceTrend.trendDirection === 'improving' ? '📈 Improving' :
                       performanceTrend.trendDirection === 'declining' ? '📉 Needs Attention' :
                       '➡️  Stable'}
                    </T>
                  </View>
                )}
              </Row>

              {/* Attendance if available */}
              {progress?.attendance_percentage !== null && progress?.attendance_percentage !== undefined && (
                <View style={{ marginBottom: Spacing.md }}>
                  <Row spaceBetween centerV style={{ marginBottom: Spacing.xs }}>
                    <T variant="caption" color="textSecondary">Attendance</T>
                    <T variant="caption" weight="semiBold">{Math.round(progress.attendance_percentage)}%</T>
                  </Row>
                  <ProgressBar
                    progress={progress.attendance_percentage / 100}
                    color={progress.attendance_percentage >= 75 ? Colors.success : Colors.warning}
                    style={{ height: 6, borderRadius: 3 }}
                  />
                </View>
              )}

              {/* Assignment completion if available */}
              {progress?.completed_assignments !== null && progress?.total_assignments !== null && (
                <View>
                  <Row spaceBetween centerV style={{ marginBottom: Spacing.xs }}>
                    <T variant="caption" color="textSecondary">Assignments Completed</T>
                    <T variant="caption" weight="semiBold">
                      {progress.completed_assignments} / {progress.total_assignments}
                    </T>
                  </Row>
                  <ProgressBar
                    progress={(progress.completed_assignments || 0) / (progress.total_assignments || 1)}
                    color={Colors.primary}
                    style={{ height: 6, borderRadius: 3 }}
                  />
                </View>
              )}
            </CardContent>
          </Card>
        )}

        {/* NEW SECTION 2B: Recent Activity Timeline */}
        {sortedGrades.length > 0 && (
          <Card variant="elevated">
            <CardContent>
              <T variant="body" weight="semiBold" style={{ marginBottom: Spacing.md }}>
                Recent Activity (Last 3 Assessments)
              </T>
              <Col gap="sm">
                {sortedGrades.slice(0, 3).map((grade, index) => (
                  <View key={grade.id} style={{ flexDirection: 'row', gap: Spacing.sm }}>
                    <View style={{ alignItems: 'center', width: 50 }}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: getPerformanceColor(grade.percentage ?? 0) + '20',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <T variant="caption" weight="bold" style={{ color: getPerformanceColor(grade.percentage ?? 0) }}>
                          {grade.grade || 'N/A'}
                        </T>
                      </View>
                      {index < 2 && <View style={{ width: 2, height: 20, backgroundColor: Colors.surfaceVariant, marginTop: 4 }} />}
                    </View>
                    <View style={{ flex: 1, paddingTop: 8 }}>
                      <T variant="body" weight="semiBold" style={{ fontSize: 14 }}>{grade.exam_name}</T>
                      <T variant="caption" color="textSecondary">
                        {(grade.percentage ?? 0).toFixed(0)}% • {grade.exam_date ? new Date(grade.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                      </T>
                    </View>
                  </View>
                ))}
              </Col>
            </CardContent>
          </Card>
        )}

        {/* NEW SECTION 2C: Quick Actions */}
        <Card variant="elevated">
          <CardContent>
            <T variant="body" weight="semiBold" style={{ marginBottom: Spacing.md }}>Quick Actions</T>
            <Row style={{ gap: Spacing.xs }}>
              <Button
                variant="primary"
                onPress={() => {
                  trackAction('view_upcoming_exams', 'SubjectDetail', { subject });
                  safeNavigate('UpcomingExams', { studentId });
                }}
                style={{ flex: 1 }}
              >
                📅 Upcoming Exams
              </Button>
              <Button
                variant="outline"
                onPress={handleShareReport}
                style={{ flex: 1 }}
              >
                📤 Share Report
              </Button>
            </Row>
          </CardContent>
        </Card>
