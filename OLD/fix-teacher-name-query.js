const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing teachers query in PlaylistsView...\n');

const filePath = path.join(__dirname, 'src/screens/student/PlaylistsView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the teachers query - change from 'name' to 'first_name, last_name'
const oldQuery = `          teachers (
            name
          )`;

const newQuery = `          teachers (
            first_name,
            last_name
          )`;

if (content.includes(oldQuery)) {
  content = content.replace(oldQuery, newQuery);

  // Also need to update the usage of teachers.name
  content = content.replace(
    `assigned_by_teacher: assignment.teachers?.name || 'Teacher',`,
    `assigned_by_teacher: assignment.teachers ? (assignment.teachers.first_name + ' ' + assignment.teachers.last_name) : 'Teacher',`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed PlaylistsView.tsx');
  console.log('  - Changed teachers query from "name" to "first_name, last_name"');
  console.log('  - Updated teacher name concatenation');
} else {
  console.log('⏭️  Already fixed or pattern not found');
}

console.log('\n✅ Complete!');
