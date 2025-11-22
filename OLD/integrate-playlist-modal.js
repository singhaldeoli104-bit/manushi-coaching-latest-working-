const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/student/NewStudyLibraryScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Step 1: Add import for AddToPlaylistModal
content = content.replace(
  `import HamburgerMenu from './HamburgerMenu';
import ResourceViewerScreen from './ResourceViewerScreen';`,
  `import HamburgerMenu from './HamburgerMenu';
import ResourceViewerScreen from './ResourceViewerScreen';
import AddToPlaylistModal from './AddToPlaylistModal';`
);

// Step 2: Update addToPlaylistModal state to include material title
content = content.replace(
  `  const [addToPlaylistModal, setAddToPlaylistModal] = useState<{visible: boolean; materialId: string | null}>({
    visible: false,
    materialId: null
  });`,
  `  const [addToPlaylistModal, setAddToPlaylistModal] = useState<{
    visible: boolean;
    materialId: string | null;
    materialTitle: string;
  }>({
    visible: false,
    materialId: null,
    materialTitle: '',
  });`
);

// Step 3: Update the + button click to include material title
content = content.replace(
  `                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setAddToPlaylistModal({ visible: true, materialId: material.id });
                    trackAction('open_add_to_playlist', 'NewStudyLibraryScreen', { materialId: material.id });
                  }}`,
  `                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setAddToPlaylistModal({
                      visible: true,
                      materialId: material.id,
                      materialTitle: material.title
                    });
                    trackAction('open_add_to_playlist', 'NewStudyLibraryScreen', { materialId: material.id });
                  }}`
);

// Step 4: Add the modal component before the closing SafeAreaView
content = content.replace(
  `      </ScrollView>
    </SafeAreaView>
  );
}`,
  `      </ScrollView>

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal
        visible={addToPlaylistModal.visible}
        materialId={addToPlaylistModal.materialId}
        materialTitle={addToPlaylistModal.materialTitle}
        onClose={() => setAddToPlaylistModal({ visible: false, materialId: null, materialTitle: '' })}
      />
    </SafeAreaView>
  );
}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Integrated Add to Playlist modal!');
console.log('  - Imported AddToPlaylistModal component');
console.log('  - Connected + button to modal');
console.log('  - Modal shows material title');
console.log('  - Students can now add materials to playlists!');
