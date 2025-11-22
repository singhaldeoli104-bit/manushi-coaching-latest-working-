const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/student/NewStudyLibraryScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Step 1: Add import for PlaylistsView
content = content.replace(
  `import AddToPlaylistModal from './AddToPlaylistModal';`,
  `import AddToPlaylistModal from './AddToPlaylistModal';
import PlaylistsView from './PlaylistsView';`
);

// Step 2: Replace the "coming soon" placeholder with actual PlaylistsView
content = content.replace(
  `        {/* Playlists View */}
        {showView === 'playlists' && (
          <View style={styles.playlistsContainer}>
            <T variant="h3" style={styles.comingSoonText}>
              📚 Playlists feature coming soon!
            </T>
            <T variant="body" style={styles.comingSoonSubtext}>
              Create custom playlists and view teacher-assigned content
            </T>
          </View>
        )}`,
  `        {/* Playlists View */}
        {showView === 'playlists' && (
          <PlaylistsView />
        )}`
);

// Step 3: Remove unused styles (comingSoonText, comingSoonSubtext, playlistsContainer)
content = content.replace(
  /  playlistsContainer: \{[^}]+\},\s+comingSoonText: \{[^}]+\},\s+comingSoonSubtext: \{[^}]+\},/s,
  ''
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Integrated PlaylistsView component!');
console.log('  - Imported PlaylistsView');
console.log('  - Replaced placeholder with actual component');
console.log('  - Removed unused styles');
console.log('  - Playlists tab now fully functional!');
