-- Migration: Add 'skipped' to onboarding_status allowed values
-- The previous CHECK constraint only allowed: not_started, in_progress, completed
-- This migration drops the old constraint and recreates it with 'skipped' added.

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_onboarding_status_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_onboarding_status_check
  CHECK (onboarding_status IN ('not_started', 'in_progress', 'completed', 'skipped'));
