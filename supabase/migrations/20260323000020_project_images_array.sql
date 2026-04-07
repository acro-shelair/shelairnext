-- Migration: Add images array column to projects table
-- Date: 2026-03-23

alter table projects
  add column if not exists images jsonb not null default '[]';
