alter table testimonials
  add column if not exists rating integer not null default 5
  check (rating >= 1 and rating <= 5);
