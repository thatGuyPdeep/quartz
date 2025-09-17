# Instructor Guide — Template

## Module
- Name:
- Duration:
- Objective:

## Setup
- Required room space:
- Headset & controllers:
- Safety briefing outline:

## Flow
1. Briefing
2. PPE check
3. Objectives
4. Scenario execution
5. Debrief

## Assessment
- Scoring weights:
- Pass criteria:
- Common mistakes:

---

# Scenario Authoring — Template (ScriptableObject)

Fields to include in SO:
- ScenarioId (string)
- Seeds (int)
- Objectives (list)
- HazardProfiles (list)
- ScoringWeights (struct)
- TimeLimit (float)

Authoring note: Bake SO → BlobAsset for DOTS runtime.
