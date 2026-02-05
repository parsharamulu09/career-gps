
# Career GPS - Smart Skill-to-Career Navigation

## 1. Concept: Career GPS
Most career platforms are like maps—they show you everything, but you don't know where you are or which turn to take. **Career GPS** is a navigation system for your career.
- **Current Position:** Your current skills & resume.
- **Destination:** Your dream role (e.g., ML Engineer).
- **Roadblocks:** Your skill gaps.
- **Route:** A structured, level-based roadmap.
- **Next Turn:** 3 hyper-focused immediate actions.

## 2. Why it's Unique
Unlike LinkedIn or Indeed which give overwhelming generic feeds, Career GPS provides:
- **Zero Noise:** Only 3 focused next actions at a time.
- **Visual Progress:** GPS-themed dashboard for high demo impact.
- **Skill Correlation:** Directly maps resume keywords to specific industry requirements using LLMs.

## 3. System Workflow
1. **Calibration:** Student inputs profile and target role.
2. **Current Location Check:** Resume is uploaded and parsed via Gemini.
3. **Route Calculation:** Gemini identifies matches vs gaps.
4. **Navigation:** User receives a 4-level roadmap and the "3 Next Steps" engine recommendations.

## 4. Logic for Readiness Score
The score is calculated via Gemini analyzing:
- **Coverage:** (Matched Required Skills / Total Required Skills) * 60%
- **Relevance:** Quality of projects/internships found in resume * 30%
- **Academic Context:** Year of study and branch alignment * 10%

## 5. UI/UX Flow
- **Landing/Onboarding:** Clean, futuristic "radar" aesthetic.
- **Uploader:** Simple form with destination selection.
- **Dashboard:** "Glassmorphism" design with high-contrast scores and radar charts.
- **Roadmap:** Vertical timeline showing "completed" vs "missing" legs of the journey.

## 6. Pitch Snippet
*"Judges, engineering students apply for jobs like they're walking in the dark. They have a map, but no GPS. Our platform, Career GPS, calculates their exact 'Current Position' by analyzing their resume and maps it to their 'Destination' role. We don't just tell them they aren't ready; we show them the exact 3 turns they need to take—a skill, a project, and an opportunity—to get there."*
