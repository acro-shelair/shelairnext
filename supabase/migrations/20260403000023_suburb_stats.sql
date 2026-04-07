-- Add stats JSONB column to location_suburbs (mirrors location_cities.stats)
alter table location_suburbs add column stats jsonb default '[]';

-- Backfill existing suburbs with default trust signals
update location_suburbs set stats = '[{"label":"Avg Response","value":"2 hrs"},{"label":"First-Visit Fix","value":"98%"},{"label":"HACCP Compliant","value":"Yes"},{"label":"Support","value":"24/7"}]';
