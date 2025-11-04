"""
UI/UX blueprint regression tests.

These tests verify that `student_analysis/ui_screens.md`
contains the required structural details for every student-facing screen.
They help ensure the documentation remains synchronized with the
design system conventions (layout, typography, scroll behaviour, etc.).
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest


ROOT = Path(__file__).resolve().parents[1]
BLUEPRINT_PATH = ROOT / "OLD" / "student_analysis" / "ui_screens.md"


@pytest.fixture(scope="session")
def ui_blueprint_text() -> str:
    if not BLUEPRINT_PATH.exists():
        pytest.skip(f"UI blueprint not found at {BLUEPRINT_PATH}")
    return BLUEPRINT_PATH.read_text(encoding="utf-8")


@pytest.fixture(scope="session")
def ui_sections(ui_blueprint_text: str) -> dict[str, str]:
    """
    Returns a mapping of section title -> section body (as a single string).
    """
    # Split on level-2 headings (## Screen Name)
    pattern = re.compile(r"^##\s+(.*?)\s*$", re.MULTILINE)
    matches = list(pattern.finditer(ui_blueprint_text))

    sections: dict[str, str] = {}
    for idx, match in enumerate(matches):
        title = match.group(1).strip()
        start = match.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(ui_blueprint_text)
        sections[title] = ui_blueprint_text[start:end].strip()

    return sections


def test_foundations_contains_scroll_table(ui_blueprint_text: str) -> None:
    assert "Layout & Scroll Conventions" in ui_blueprint_text, "Global layout conventions table missing"
    assert "StudentTopBar" in ui_blueprint_text
    assert "Scroll Behaviour" in ui_blueprint_text


SCREEN_EXPECTATIONS = [
    "1. Student Dashboard (`StudentDashboard.tsx`)",
    "2. Student AI Learning Dashboard (`StudentAILearningDashboard.tsx`)",
    "3. Schedule Screen (`ScheduleScreen.tsx`)",
    "4. Enhanced Schedule Screen (`EnhancedScheduleScreen.tsx`)",
    "5. Class Detail (`ClassDetailScreen.tsx`)",
    "6. Student Live Class (`StudentLiveClassScreen.tsx`)",
    "7. Live Class Participation (`LiveClassParticipationScreen.tsx`)",
    "8. Enhanced Live Class Participation (`EnhancedLiveClassParticipationScreen.tsx`)",
    "9. Enhanced Interactive Classroom (`EnhancedInteractiveClassroomScreen.tsx`)",
    "10. Live Collaboration Studio (`LiveCollaborationStudio.tsx`)",
    "11. Virtual Classroom Interface (`VirtualClassroomInterface.tsx`)",
    "12. AI Study Screen (`AIStudyScreen.tsx`)",
    "13. Enhanced AI Study Assistant (`EnhancedAIStudyAssistantScreen.tsx`)",
    "14. AI Tutor Chat Interface (`AITutorChatInterface.tsx`)",
    "15. Activity Detail (`ActivityDetailScreen.tsx`)",
    "16. Collaborative Assignment Workspace (`CollaborativeAssignmentWorkspace.tsx`)",
    "17. Peer Learning Network (`PeerLearningNetwork.tsx`)",
    "18. Gamified Learning Hub (`GamifiedLearningHub.tsx`)",
    "19. Assignment Detail (`AssignmentDetailScreen.tsx`)",
    "20. Doubt Submission (`DoubtSubmissionScreen.tsx`)",
    "21. Simple Doubt Submission (`SimpleDoubtSubmissionScreen.tsx`)",
    "22. Study Library (`StudyLibraryScreen.tsx`)",
    "23. Progress Detail (`ProgressDetailScreen.tsx`)",
    "24. Component Test Screen (`ComponentTestScreen.tsx`)",
    "25. Additional Live/Activity Screens",
]


@pytest.mark.parametrize("title", SCREEN_EXPECTATIONS)
def test_each_screen_has_required_subsections(title: str, ui_sections: dict[str, str]) -> None:
    assert title in ui_sections, f"Missing section for {title}"
    section = ui_sections[title]

    # Required subsections
    required_subheadings = [
        "**Layout & Scroll**",
        "**Typography & Sizing**",
        "**UX Notes**",
        "**Audit Findings**",
        "**Next Steps**",
    ]

    missing = [heading for heading in required_subheadings if heading not in section]
    assert not missing, f"{title} missing subsections: {', '.join(missing)}"

    # Expect references to measurement units (dp/sp) in layout or typography notes
    dp_matches = re.findall(r"\b\d+\s*dp\b", section)
    sp_matches = re.findall(r"\b\d+\s*sp\b", section)
    assert dp_matches, f"{title} lacks dp sizing references"
    assert sp_matches, f"{title} lacks sp font references"


def test_additional_section_lists_groups(ui_sections: dict[str, str]) -> None:
    section = ui_sections.get("25. Additional Live/Activity Screens", "")
    assert "Virtual Classroom Variants" in section
    assert "Activity & Assignment Sisters" in section
    assert "AI & Collaboration Set" in section
