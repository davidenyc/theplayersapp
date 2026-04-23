export type Role = "admin" | "coach" | "player";

export interface Organization {
  id: string;
  name: string;
  logo_url?: string;
  created_at: string;
}

export interface Team {
  id: string;
  org_id: string;
  name: string;
  sport: string;
  season: string;
  created_at: string;
}

export interface Profile {
  id: string;
  role: Role;
  org_id: string;
  full_name: string;
  avatar_url?: string;
  email: string;
}

export interface PlayerProfile {
  id: string;
  user_id: string;
  team_id: string;
  position: string;
  dominant_foot?: string;
  height_cm?: number;
  weight_kg?: number;
  date_of_birth?: string;
  graduation_year?: number;
  school?: string;
  bio?: string;
  jersey_number?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
}

export interface CoachProfile {
  id: string;
  user_id: string;
  team_id: string;
  title?: string;
  specialization?: string;
}

export interface Event {
  id: string;
  team_id: string;
  title: string;
  type: "training" | "game" | "meeting" | "other";
  location?: string;
  starts_at: string;
  ends_at: string;
  notes?: string;
  created_by: string;
}

export interface Attendance {
  id: string;
  event_id: string;
  user_id: string;
  status: "attending" | "not_attending" | "maybe" | "no_response";
  updated_at: string;
}

export interface Announcement {
  id: string;
  team_id: string;
  author_id: string;
  title: string;
  body: string;
  pinned: boolean;
  created_at: string;
}

export interface SurveyTemplate {
  id: string;
  team_id: string;
  created_by: string;
  name: string;
  description?: string;
  questions: SurveyQuestion[];
  is_active: boolean;
  created_at: string;
}

export interface SurveyQuestion {
  id: string;
  label: string;
  type: "scale" | "boolean" | "number" | "text";
  min?: number;
  max?: number;
  required: boolean;
  flag_below?: number;
  flag_above?: number;
}

export interface SurveyAssignment {
  id: string;
  template_id: string;
  team_id: string;
  assigned_by: string;
  deadline_time: string;
  recurrence: "daily" | "weekdays" | "weekly" | "once";
  active_from: string;
  active_until?: string;
  is_active: boolean;
}

export interface SurveyResponse {
  id: string;
  assignment_id: string;
  template_id: string;
  player_id: string;
  submitted_at: string;
  answers: Record<string, number | boolean | string>;
  readiness_score?: number;
  flagged: boolean;
  flag_reasons: string[];
}

export interface BiomarkerEntry {
  id: string;
  player_id: string;
  recorded_at: string;
  metric: string;
  value: number;
  unit: string;
  source: "manual" | "survey" | "wearable";
  notes?: string;
}

export interface Goal {
  id: string;
  player_id: string;
  title: string;
  category:
    | "performance"
    | "fitness"
    | "technical"
    | "tactical"
    | "academic"
    | "recovery";
  description?: string;
  kpi?: string;
  target_value?: number;
  current_value?: number;
  progress_pct: number;
  start_date: string;
  target_date: string;
  status: "active" | "completed" | "paused";
  coach_comment?: string;
  created_at: string;
}

export interface StatRecord {
  id: string;
  player_id: string;
  team_id: string;
  season: string;
  event_id?: string;
  recorded_at: string;
  appearances: number;
  starts: number;
  minutes_played: number;
  goals: number;
  assists: number;
  tackles_won: number;
  interceptions: number;
  duels_won: number;
  pass_completion_pct: number;
  yellow_cards: number;
  red_cards: number;
  clean_sheets: number;
}

export interface PersonalRecord {
  id: string;
  player_id: string;
  category: "sprint" | "jump" | "fitness" | "season" | "career" | "combine";
  label: string;
  value: number;
  unit: string;
  set_on: string;
  notes?: string;
}

export interface Highlight {
  id: string;
  player_id: string;
  title: string;
  description?: string;
  type: "upload" | "link";
  url: string;
  thumbnail_url?: string;
  category:
    | "defending"
    | "passing"
    | "finishing"
    | "goalkeeping"
    | "athletic"
    | "leadership"
    | "general";
  match_date?: string;
  opponent?: string;
  is_pinned: boolean;
  coach_feedback?: string;
  created_at: string;
}

export interface CoachNote {
  id: string;
  player_id: string;
  author_id: string;
  body: string;
  is_shared: boolean;
  created_at: string;
}

export interface Evaluation {
  id: string;
  player_id: string;
  coach_id: string;
  period: string;
  ratings: Record<string, number>;
  summary?: string;
  created_at: string;
}

type TableDefinition<Row, Insert = Row, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Views: Record<string, never>;
    Tables: {
      profiles: TableDefinition<Profile>;
      organizations: TableDefinition<Organization>;
      teams: TableDefinition<Team>;
      player_profiles: TableDefinition<PlayerProfile>;
      coach_profiles: TableDefinition<CoachProfile>;
      events: TableDefinition<Event>;
      attendance: TableDefinition<Attendance>;
      announcements: TableDefinition<Announcement>;
      survey_templates: TableDefinition<SurveyTemplate>;
      survey_assignments: TableDefinition<SurveyAssignment>;
      survey_responses: TableDefinition<SurveyResponse>;
      biomarker_entries: TableDefinition<BiomarkerEntry>;
      goals: TableDefinition<Goal>;
      stat_records: TableDefinition<StatRecord>;
      personal_records: TableDefinition<PersonalRecord>;
      highlights: TableDefinition<Highlight>;
      coach_notes: TableDefinition<CoachNote>;
      evaluations: TableDefinition<Evaluation>;
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export interface PlayerListItem {
  profile: Profile;
  playerProfile: PlayerProfile;
  latestResponse?: SurveyResponse;
}

export interface ReadinessCardData {
  id: string;
  name: string;
  avatarUrl?: string;
  readinessScore: number;
  flagCount: number;
  completed: boolean;
  position: string;
}
