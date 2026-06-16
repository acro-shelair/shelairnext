-- Migration: make all industry detail-page section headings & labels editable

alter table industries
  add column if not exists label_get_quote     text not null default 'Get a Quote',
  add column if not exists challenges_heading   text not null default 'Your Challenges',
  add column if not exists challenges_intro     text not null default '',
  add column if not exists services_heading     text not null default 'How We Help',
  add column if not exists case_study_label     text not null default 'Case Study',
  add column if not exists label_challenge      text not null default 'Challenge',
  add column if not exists label_solution       text not null default 'Solution',
  add column if not exists label_result         text not null default 'Result',
  add column if not exists related_heading      text not null default 'Other Industries We Serve',
  add column if not exists label_learn_more     text not null default 'Learn More';
