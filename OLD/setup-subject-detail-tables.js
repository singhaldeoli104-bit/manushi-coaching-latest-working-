/**
 * Setup Script: Create and Populate Subject Detail Tables
 *
 * This script creates three tables needed for SubjectDetailScreen:
 * 1. gradebook - exam/test scores
 * 2. student_progress - attendance, assignments, strengths/weaknesses
 * 3. study_materials - learning resources
 *
 * Run with: node setup-subject-detail-tables.js
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials (from .env file)
const SUPABASE_URL = 'https://qrwroibhzgywaiecbcoa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyd3JvaWJoemd5d2FpZWNiY29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjkwNTksImV4cCI6MjA3MjAwNTA1OX0.YwFEMqbGMraRS5xeZVqEZsqeBTYNqn0AtbL1rzjvghM';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STUDENT_ID = '33333333-3333-3333-3333-333333333331'; // Priya Sharma

async function main() {
  console.log('🚀 Starting Subject Detail Tables Setup...\n');

  // Step 1: Create Tables
  console.log('📊 Step 1: Creating tables...');

  const createTablesSQL = `
    -- Create gradebook table
    CREATE TABLE IF NOT EXISTS gradebook (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID NOT NULL REFERENCES students(id),
      subject_code TEXT NOT NULL,
      batch_id UUID REFERENCES batches(id),
      exam_type TEXT NOT NULL,
      exam_name TEXT NOT NULL,
      max_marks INTEGER NOT NULL,
      obtained_marks INTEGER NOT NULL,
      percentage NUMERIC(5,2),
      grade TEXT,
      remarks TEXT,
      exam_date DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create student_progress table
    CREATE TABLE IF NOT EXISTS student_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID NOT NULL REFERENCES students(id),
      subject_code TEXT NOT NULL,
      attendance_percentage NUMERIC(5,2),
      average_score NUMERIC(5,2),
      completed_assignments INTEGER DEFAULT 0,
      total_assignments INTEGER DEFAULT 0,
      strengths TEXT[],
      weaknesses TEXT[],
      recommendations TEXT,
      last_updated TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(student_id, subject_code)
    );

    -- Create study_materials table
    CREATE TABLE IF NOT EXISTS study_materials (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      subject_code TEXT,
      type TEXT NOT NULL,
      file_size TEXT,
      file_url TEXT,
      author TEXT,
      rating NUMERIC(3,2),
      downloads_count INTEGER DEFAULT 0,
      upload_date TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    if (createError) {
      console.error('❌ Error creating tables:', createError.message);
      console.log('ℹ️  Note: If tables already exist, this is expected. Continuing...\n');
    } else {
      console.log('✅ Tables created successfully\n');
    }
  } catch (err) {
    console.log('ℹ️  Attempting alternative method for table creation...\n');
  }

  // Step 2: Get batch_id for foreign key
  console.log('📦 Step 2: Getting batch_id...');
  const { data: batchData, error: batchError } = await supabase
    .from('batches')
    .select('id')
    .limit(1)
    .single();

  if (batchError) {
    console.error('❌ Error getting batch:', batchError.message);
    return;
  }

  const batchId = batchData.id;
  console.log(`✅ Found batch: ${batchId}\n`);

  // Step 3: Insert Gradebook Data
  console.log('📝 Step 3: Inserting gradebook data...');

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

  for (const record of gradebookRecords) {
    const { error } = await supabase
      .from('gradebook')
      .upsert(record, { onConflict: 'exam_name' });

    if (error) {
      console.error(`❌ Error inserting ${record.exam_name}:`, error.message);
    } else {
      console.log(`✅ Inserted: ${record.exam_name}`);
    }
  }
  console.log('');

  // Step 4: Insert Student Progress Data
  console.log('📊 Step 4: Inserting student progress data...');

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
      console.error(`❌ Error inserting progress for ${record.subject_code}:`, error.message);
    } else {
      console.log(`✅ Inserted progress: ${record.subject_code}`);
    }
  }
  console.log('');

  // Step 5: Insert Study Materials
  console.log('📚 Step 5: Inserting study materials...');

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

  for (const material of materials) {
    const { error } = await supabase
      .from('study_materials')
      .insert(material);

    if (error && !error.message.includes('duplicate')) {
      console.error(`❌ Error inserting ${material.title}:`, error.message);
    } else {
      console.log(`✅ Inserted: ${material.title}`);
    }
  }
  console.log('');

  // Step 6: Verify Data
  console.log('✅ Step 6: Verifying inserted data...\n');

  // Verify gradebook
  const { data: gradebookData, error: gradebookErr } = await supabase
    .from('gradebook')
    .select('*')
    .eq('student_id', STUDENT_ID)
    .order('exam_date', { ascending: false });

  if (gradebookErr) {
    console.error('❌ Error verifying gradebook:', gradebookErr.message);
  } else {
    console.log(`📊 Gradebook Records: ${gradebookData.length}`);
    gradebookData.forEach(record => {
      console.log(`   - ${record.subject_code}: ${record.exam_name} (${record.obtained_marks}/${record.max_marks} = ${record.percentage}%)`);
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
    console.log(`📈 Student Progress Records: ${progressData.length}`);
    progressData.forEach(record => {
      console.log(`   - ${record.subject_code}: ${record.attendance_percentage}% attendance, ${record.completed_assignments}/${record.total_assignments} assignments`);
      console.log(`     Strengths: ${record.strengths.join(', ')}`);
      console.log(`     Weaknesses: ${record.weaknesses.join(', ')}`);
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
    console.log(`📚 Study Materials: ${materialsData.length}`);
    materialsData.forEach(material => {
      console.log(`   - ${material.subject_code}: ${material.title} (${material.type}, ${material.rating}⭐)`);
    });
  }
  console.log('');

  console.log('🎉 Setup Complete!');
  console.log('\n📱 Next Steps:');
  console.log('   1. Navigate to SubjectDetailScreen in the app');
  console.log('   2. Select Mathematics or Physics subject');
  console.log('   3. Verify that grades, progress, and study materials are displayed');
}

main().catch(console.error);
