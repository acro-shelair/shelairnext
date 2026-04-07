-- Migration: Add image_url column to industries table
-- Date: 2026-03-23

alter table industries
  add column if not exists image_url text;
