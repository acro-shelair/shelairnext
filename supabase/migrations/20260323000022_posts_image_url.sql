-- Migration: Add image_url column to posts table
-- Date: 2026-03-23

alter table posts
  add column if not exists image_url text;
