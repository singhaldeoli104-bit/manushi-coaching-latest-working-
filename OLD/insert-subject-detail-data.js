/**
 * Insert Sample Data for Subject Detail Screen
 *
 * Prerequisites:
 * 1. Run create-subject-detail-tables.sql in Supabase SQL Editor first
 * 2. Ensure tables exist: gradebook, student_progress, study_materials
 *
 * Run with: node insert-subject-detail-data.js
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials (from .env file)
const SUPABASE_URL = 'https://qrwroibhzgywaiecbcoa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyd3JvaWJoemd5d2FpZWNiY29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjkwNTksImV4cCI6MjA3MjAwNTA1OX0.YwFEMqbGMraRS5xeZVqEZsqeBTYNqn0AtbL1rzjvghM';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STUDENT_ID = '33333333-3333-3333-3333-333333333331'; // Priya Sharma

async function insertData() {
  console.log('🚀 Starting data insertion for SubjectDetailScreen...\n');

  // Step 1: Get batch_id
  console.log('📦 Step 1: Getting batch_id...');
  const { data: batchData, error: batchError } = await supabase
    .from('batches')
    .select('id')
    .limit(1)
    .single();

  if (batchError) {
    console.error('❌ Error getting batch:', batchError.message);
    console.log('ℹ️  Make sure the batches table has at least one record.');
    return;
  }

  const batchId = batchData.id;
  console.log(`✅ Found batch: ${batchId}\n`);

  // Step 2: Insert Gradebook Data
  console.log('📝 Step 2: Inserting gradebook records...');

  const gradebookRecords = [
    {
      student_id: STUDENT_ID,
      subject_code: 'Mathematics',
      batch_id: batchId,
      exam_type: 'quiz',
      exam_name: 'Unit 1 Quiz - Algebra',
      max_marks: 20,
      obtained_marks: 18,
      percentage: 90.00,
      grade: 'A',
      remarks: 'Excellent understanding of concepts',
      exam_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      student_id: STUDENT_ID,
      subject_code: 'Mathematics',
      batch_id: batchId,
      exam_type: 'test',
      exam_name: 'Mid-Term Test - Geometry',
      max_marks: 100,
      obtained_marks: 85,
      percentage: 85.00,
      grade: 'A',
      remarks: 'Strong performance in geometry',
      exam_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      student_id: STUDENT_ID,
      subject_code: 'Mathematics',
      batch_id: batchId,
      exam_type: 'assignment',
      exam_name: 'Homework Assignment 5',
      max_marks: 10,
      obtained_marks: 9,
      percentage: 90.00,
      grade: 'A',
      remarks: 'Complete and accurate work',
      exam_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      student_id: STUDENT_ID,
      subject_code: 'Physics',
      batch_id: batchId,
      exam_type: 'quiz',
      exam_name: 'Laws of Motion Quiz',
      max_marks: 25,
      obtained_marks: 22,
      percentage: 88.00,
      grade: 'A',
      remarks: 'Good grasp of Newtons laws',
      exam_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      student_id: STUDENT_ID,
      subject_code: 'Physics',
      batch_id: batchId,
      exam_type: 'test',
      exam_name: 'Mechanics Test',
      max_marks: 100,
      obtained_marks: 78,
      percentage: 78.00,
      grade: 'B',
      remarks: 'Needs improvement in numerical problems',
      exam_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  ];

  let insertedCount = 0;
  for (const record of gradebookRecords) {
    const { error } = await supabase.from('gradebook').insert(record);

    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        console.log(`⚠️  Skipped (already exists): ${record.exam_name}`);
      } else {
        console.error(`❌ Error inserting ${record.exam_name}:`, error.message);
      }
    } else {
      console.log(`✅ Inserted: ${record.exam_name}`);
      insertedCount++;
    }
  }
  console.log(`📊 Gradebook: ${insertedCount}/${gradebookRecords.length} new records inserted\n`);

  // Step 3: Insert Student Progress Data
  console.log('📈 Step 3: Inserting student progress records...');

  const progressRecords = [
    {
      student_id: STUDENT_ID,
      subject_code: 'Mathematics',
      attendance_percentage: 95.5,
      average_score: 88.33,
      completed_assignments: 8,
      total_assignments: 10,
      strengths: ['Algebra', 'Problem solving', 'Logical thinking'],
      weaknesses: ['Complex word problems', 'Speed'],
      recommendations: 'Focus on practicing timed problem sets to improve speed'
    },
    {
      student_id: STUDENT_ID,
      subject_code: 'Physics',
      attendance_percentage: 92.0,
      average_score: 83.00,
      completed_assignments: 7,
      total_assignments: 10,
      strengths: ['Theory concepts', 'Diagrams'],
      weaknesses: ['Numerical problems', 'Formula application'],
      recommendations: 'Practice more numerical problems and formula derivations'
    }
  ];

  for (const record of progressRecords) {
    const { error } = await supabase
      .from('student_progress')
      .upsert(record, { onConflict: 'student_id,subject_code' });

    if (error) {
      console.error(`❌ Error upserting progress for ${record.subject_code}:`, error.message);
    } else {
      console.log(`✅ Upserted progress: ${record.subject_code}`);
    }
  }
  console.log('');

  // Step 4: Insert Study Materials
  console.log('📚 Step 4: Inserting study materials...');

  const materials = [
    {
      title: 'Algebra Chapter Notes',
      subject_code: 'Mathematics',
      type: 'pdf',
      file_size: '2.5 MB',
      file_url: 'https://example.com/algebra.pdf',
      author: 'Prof. Kumar',
      rating: 4.5,
      downloads_count: 245
    },
    {
      title: 'Geometry Practice Problems',
      subject_code: 'Mathematics',
      type: 'practice',
      file_size: '1.8 MB',
      file_url: 'https://example.com/geometry.pdf',
      author: 'Prof. Kumar',
      rating: 4.8,
      downloads_count: 312
    },
    {
      title: 'Laws of Motion Video Lecture',
      subject_code: 'Physics',
      type: 'video',
      file_size: '45 MB',
      file_url: 'https://example.com/motion.mp4',
      author: 'Dr. Singh',
      rating: 4.7,
      downloads_count: 189
    },
    {
      title: 'Mechanics Formula Sheet',
      subject_code: 'Physics',
      type: 'pdf',
      file_size: '500 KB',
      file_url: 'https://example.com/mechanics.pdf',
      author: 'Dr. Singh',
      rating: 4.9,
      downloads_count: 456
    }
  ];

  let materialsInserted = 0;
  for (const material of materials) {
    const { error } = await supabase.from('study_materials').insert(material);

    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        console.log(`⚠️  Skipped (already exists): ${material.title}`);
      } else {
        console.error(`❌ Error inserting ${material.title}:`, error.message);
      }
    } else {
      console.log(`✅ Inserted: ${material.title}`);
      materialsInserted++;
    }
  }
  console.log(`📚 Study Materials: ${materialsInserted}/${materials.length} new records inserted\n`);

  // Step 5: Verify Data
  console.log('✅ Step 5: Verifying inserted data...\n');

  // Verify gradebook
  const { data: gradebookData, error: gradebookErr } = await supabase
    .from('gradebook')
    .select('*')
    .eq('student_id', STUDENT_ID)
    .order('exam_date', { ascending: false });

  if (gradebookErr) {
    console.error('❌ Error verifying gradebook:', gradebookErr.message);
  } else {
    console.log(`📊 Total Gradebook Records: ${gradebookData.length}`);
    gradebookData.forEach(record => {
      console.log(`   ${record.subject_code}: ${record.exam_name} - ${record.obtained_marks}/${record.max_marks} (${record.percentage}% - ${record.grade})`);
    });
  }
  console.log('');

  // Verify student_progress
  const { data: progressData, error: progressErr } = await supabase
    .from('student_progress')
    .select('*')
    .eq('student_id', STUDENT_ID);

  if (progressErr) {
    console.error('❌ Error verifying progress:', progressErr.message);
  } else {
    console.log(`📈 Total Student Progress Records: ${progressData.length}`);
    progressData.forEach(record => {
      console.log(`   ${record.subject_code}:`);
      console.log(`      Attendance: ${record.attendance_percentage}%`);
      console.log(`      Average: ${record.average_score}%`);
      console.log(`      Assignments: ${record.completed_assignments}/${record.total_assignments}`);
      console.log(`      Strengths: ${record.strengths.join(', ')}`);
      console.log(`      Weaknesses: ${record.weaknesses.join(', ')}`);
    });
  }
  console.log('');

  // Verify study_materials
  const { data: materialsData, error: materialsErr } = await supabase
    .from('study_materials')
    .select('*')
    .in('subject_code', ['Mathematics', 'Physics'])
    .order('subject_code');

  if (materialsErr) {
    console.error('❌ Error verifying materials:', materialsErr.message);
  } else {
    console.log(`📚 Total Study Materials: ${materialsData.length}`);
    materialsData.forEach(material => {
      console.log(`   ${material.subject_code}: ${material.title} (${material.type}) - ${material.rating}⭐, ${material.downloads_count} downloads`);
    });
  }
  console.log('');

  console.log('🎉 Data insertion complete!');
  console.log('\n📱 Next Steps:');
  console.log('   1. Open the app and navigate to NewParentDashboard');
  console.log('   2. Tap on "Mathematics" or "Physics" subject card');
  console.log('   3. Verify SubjectDetailScreen displays:');
  console.log('      - Grades section with exam scores');
  console.log('      - Progress section with attendance and strengths/weaknesses');
  console.log('      - Study materials list');
}

insertData()
  .catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
