-- Expand activity_logs action constraint to include auth events

alter table activity_logs
  drop constraint activity_logs_action_check;

alter table activity_logs
  add constraint activity_logs_action_check
  check (action in ('create', 'update', 'delete', 'login', 'logout'));
