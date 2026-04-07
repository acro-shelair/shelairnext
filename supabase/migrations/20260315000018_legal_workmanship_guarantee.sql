-- Migration: legal_workmanship_guarantee
-- Extends legal_pages to support a 'guarantee' document type, then seeds the
-- Shelair 5-Year Workmanship Guarantee as a standalone legal page.
-- Source: https://shelair.com.au/terms/
--
-- After running this migration you should also:
--   1. Update lib/supabase/legal.ts → getLegalPage() to accept 'guarantee' as a type.
--   2. Update the admin LegalEditor to add a third tab for the guarantee document.
--   3. Review T&C section "16. Warranty" — it currently states a 12-month workmanship
--      warranty. Consider updating it via the admin editor to reference this 5-year
--      guarantee document for consistency.

-- ── 1. Extend the CHECK constraint ─────────────────────────────────────────

ALTER TABLE legal_pages
  DROP CONSTRAINT legal_pages_type_check;

ALTER TABLE legal_pages
  ADD CONSTRAINT legal_pages_type_check
  CHECK (type IN ('terms', 'privacy', 'guarantee'));

-- ── 2. Insert the guarantee document ───────────────────────────────────────

INSERT INTO legal_pages (type, title, intro, effective_date, qbcc, abn, sections) VALUES (
  'guarantee',
  'Shelair – 5-Year Workmanship Guarantee',
  'At Shelair, we stand by the quality of our work. Every installation and repair performed by our technicians is backed by our 5-Year Workmanship Guarantee — covering labour quality, not just parts. This document sets out the full scope of that guarantee, what is and is not covered, and how to make a claim.',
  '1 June 2025',
  '15413155',
  '43 672 578 264',
  '[
    {
      "heading": "1. Scope of Guarantee",
      "body": "This guarantee applies to all commercial HVAC and refrigeration installation and repair work performed by Shelair technicians on or after 1 June 2025.\n\nThis guarantee covers labour only. It applies to faults arising from incorrect installation, poor workmanship, or failure to follow applicable codes and industry standards. It does not cover the parts or equipment themselves — those remain subject to the relevant manufacturer''s warranty."
    },
    {
      "heading": "2. What Is Covered",
      "body": "The following are covered under this guarantee at no additional labour cost to the client:\n\nLabour to correct any installation or repair work that is proven faulty or non-compliant with applicable codes and standards.\n\nSite attendance and technician time required to diagnose and rectify faults directly caused by our workmanship.\n\nReinstallation or repair of systems where poor workmanship by our technicians is identified as the root cause of the fault."
    },
    {
      "heading": "3. What Is Not Covered",
      "body": "The following are excluded from this guarantee:\n\nReplacement parts or equipment — these are covered under the relevant manufacturer''s warranty, which Shelair will assist you in lodging where applicable.\n\nFailures caused by power surges, misuse, vandalism, neglect, flood, fire, or other environmental damage.\n\nFaults resulting from unauthorised repairs, modifications, or servicing performed by parties other than Shelair after our original work.\n\nLabour required to repair faults caused by equipment failure that is unrelated to our workmanship.\n\nSystems that have not been maintained in accordance with industry standards or the applicable Shelair service agreement."
    },
    {
      "heading": "4. Relationship to Manufacturer''s Warranty",
      "body": "This 5-Year Workmanship Guarantee is provided in addition to — and does not replace or limit — the original manufacturer''s warranty on any parts or equipment supplied.\n\nWhere a fault may involve both a workmanship issue and a parts failure, Shelair will assess the root cause and coordinate the appropriate resolution, whether that is under this guarantee, the manufacturer''s warranty, or both."
    },
    {
      "heading": "5. Conditions of Guarantee",
      "body": "To remain eligible under this guarantee, the following conditions must be met:\n\nThe system must have been installed or serviced exclusively by Shelair for the scope covered by this guarantee.\n\nThe system must be maintained in accordance with industry standards and any applicable Shelair service agreement. Failure to maintain the system appropriately may void the guarantee for faults attributable to that lack of maintenance.\n\nAll claims must be submitted in writing to Shelair within the 5-year guarantee period from the date of the original installation or repair."
    },
    {
      "heading": "6. How to Make a Claim",
      "body": "To lodge a guarantee claim, contact Shelair directly:\n\nPhone: 1300 227 600\n\nEmail: workshop@shelair.com.au\n\nOn receipt of a claim, Shelair will arrange a technician assessment at no charge. If the fault is determined to be caused by our workmanship, all labour required to diagnose and rectify the fault will be provided at no cost to the client. Parts required for the rectification remain subject to the manufacturer''s warranty or a separate quotation."
    },
    {
      "heading": "7. Disputes and Final Determination",
      "body": "In the event of a dispute regarding the cause of a fault or the applicability of this workmanship guarantee, Shelair reserves the right to make a final technical determination based on an on-site assessment.\n\nWhere the client disagrees with that determination, disputes should be referred to the process outlined in our Terms & Conditions, which include good-faith negotiation followed by mediation before legal proceedings."
    },
    {
      "heading": "8. Governing Law",
      "body": "This guarantee is governed by the laws of Queensland, Australia. Nothing in this guarantee excludes, restricts, or modifies any right or remedy the client may have under the Australian Consumer Law or any other applicable legislation that cannot be excluded by agreement.\n\nHVACR Pty Ltd trading as Shelair | ABN 43 672 578 264 | QBCC Licence 15413155"
    }
  ]'::jsonb
);
