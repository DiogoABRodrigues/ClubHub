DO $$
DECLARE
  constraint_record record;
  index_record record;
BEGIN
  FOR constraint_record IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'matches'::regclass
      AND contype = 'u'
      AND pg_get_constraintdef(oid) ILIKE '%"teamName"%'
      AND pg_get_constraintdef(oid) ILIKE '%opponent%'
      AND pg_get_constraintdef(oid) ILIKE '%"homeOrAway"%'
      AND pg_get_constraintdef(oid) ILIKE '%"competitionId"%'
      AND pg_get_constraintdef(oid) NOT ILIKE '%date%'
  LOOP
    EXECUTE format(
      'ALTER TABLE matches DROP CONSTRAINT IF EXISTS %I',
      constraint_record.conname
    );
  END LOOP;

  FOR index_record IN
    SELECT indexname
    FROM pg_indexes
    WHERE schemaname = current_schema()
      AND tablename = 'matches'
      AND indexdef ILIKE '%UNIQUE%'
      AND indexdef ILIKE '%"teamName"%'
      AND indexdef ILIKE '%"opponent"%'
      AND indexdef ILIKE '%"homeOrAway"%'
      AND indexdef ILIKE '%"competitionId"%'
      AND indexdef NOT ILIKE '%"date"%'
  LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', index_record.indexname);
  END LOOP;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS matches_identity_unique
  ON matches ("teamName", opponent, "homeOrAway", "competitionId", date, category);
CREATE INDEX IF NOT EXISTS matches_season_category_date_idx
  ON matches ("seasonId", category, date DESC);
CREATE INDEX IF NOT EXISTS matches_date_status_category_idx
  ON matches (date, status, category);
CREATE INDEX IF NOT EXISTS competitions_season_category_idx
  ON competitions ("seasonId", category);
CREATE INDEX IF NOT EXISTS competitions_external_id_idx
  ON competitions ("externalId");
CREATE INDEX IF NOT EXISTS standings_season_category_idx
  ON standings ("seasonId", category);
CREATE INDEX IF NOT EXISTS standings_competition_season_category_idx
  ON standings ("competitionId", "seasonId", category);
CREATE INDEX IF NOT EXISTS lineups_match_idx
  ON lineups ("matchId");
CREATE UNIQUE INDEX IF NOT EXISTS lineups_match_player_unique
  ON lineups ("matchId", "playerId");
CREATE INDEX IF NOT EXISTS match_events_match_minute_idx
  ON match_events ("matchId", minute);
CREATE INDEX IF NOT EXISTS news_published_at_idx
  ON news ("publishedAt" DESC);
CREATE INDEX IF NOT EXISTS feedback_created_at_idx
  ON feedbacks ("createdAt" DESC);
