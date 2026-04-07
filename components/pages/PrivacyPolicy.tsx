import Layout from "@/components/Layout";
import type { LegalPage } from "@/lib/supabase/legal";

interface Props {
  legalData?: LegalPage | null;
}

const PrivacyPolicy = ({ legalData }: Props) => {
  if (legalData) {
    return (
      <Layout>
        <div className="container-narrow section-padding">
          <h1 className="text-4xl font-extrabold mb-4">{legalData.title}</h1>
          {legalData.effective_date && (
            <p className="text-muted-foreground mb-8">
              Last updated: {legalData.effective_date}
            </p>
          )}

          <div className="prose prose-lg max-w-none space-y-8 text-foreground/80">
            {legalData.sections.map((section, idx) => (
              <section key={idx}>
                {section.heading && (
                  <h2 className="text-2xl font-bold text-foreground">
                    {section.heading}
                  </h2>
                )}
                <div className="space-y-4">
                  {section.body
                    .split("\n\n")
                    .map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Static fallback — original hardcoded JSX
  return (
    <Layout>
      <div className="container-narrow section-padding">
        <h1 className="text-4xl font-extrabold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground/80">
          <section>
            <p>
              Shelair is Brisbane and South-East Queensland&apos;s trusted
              commercial air conditioning specialist, providing 24/7 emergency
              repairs, preventative maintenance, and cold room construction since
              1972. We are committed to handling your personal information
              responsibly and transparently. This Privacy Policy explains how Shelair
              Refrigeration collects, uses, stores, and discloses personal
              information in accordance with the{" "}
              <em>Australian Privacy Act 1988</em> (Cth) and the Australian
              Privacy Principles (APPs).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">
              1. Introduction
            </h2>
            <p>
              Shelair (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting
              the privacy of our clients, website visitors, and business partners.
              If you have questions about this policy or how we handle your data,
              please contact us using the details in Section 11.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">
              2. Information We Collect
            </h2>
            <p>We may collect the following types of personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Contact details:</strong> Name, phone number, email
                address, and business address
              </li>
              <li>
                <strong>Business information:</strong> Company name, ABN, site
                location, and equipment details
              </li>
              <li>
                <strong>Service records:</strong> Details of equipment serviced,
                maintenance history, and job reports
              </li>
              <li>
                <strong>Website usage data:</strong> IP address, browser type,
                pages visited, and cookies (see Section 7)
              </li>
              <li>
                <strong>Communication records:</strong> Emails, phone call notes,
                and form submissions
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">
              3. How We Collect Information
            </h2>
            <p>We collect personal information through:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact and quote request forms on this website</li>
              <li>Phone calls and emails with our team</li>
              <li>Service visits and on-site inspections</li>
              <li>Third-party referrals and supplier networks</li>
              <li>Automated website analytics tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">
              4. How We Use Your Information
            </h2>
            <p>We use personal information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Provide, schedule, and manage commercial air conditioning and cold
                room services
              </li>
              <li>Prepare quotes, invoices, and service reports</li>
              <li>
                Communicate about appointments, maintenance schedules, and
                follow-ups
              </li>
              <li>
                Comply with licensing, safety, and regulatory obligations (QBCC,
                ARC)
              </li>
              <li>Improve our website, services, and customer experience</li>
              <li>
                Send relevant service updates or promotional information (with
                your consent)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">
              5. Disclosure of Information
            </h2>
            <p>We may share your personal information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Equipment suppliers and manufacturers (e.g., Bitzer, Copeland,
                Danfoss) for warranty and service purposes
              </li>
              <li>Subcontractors engaged to perform services on our behalf</li>
              <li>
                Regulatory authorities where required by law (e.g., QBCC, ARC,
                electrical safety regulators)
              </li>
              <li>Professional advisors such as accountants or legal counsel</li>
            </ul>
            <p>
              We do not sell or rent your personal information to third parties
              for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">
              6. Data Security
            </h2>
            <p>
              We take reasonable steps to protect personal information from
              misuse, interference, loss, and unauthorised access or disclosure.
              This includes secure digital storage, access controls, and staff
              training on privacy obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">
              7. Cookies &amp; Analytics
            </h2>
            <p>
              Our website uses cookies and analytics tools to understand how
              visitors interact with our site. This data is collected anonymously
              and used to improve website performance and user experience. You can
              manage cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">8. Your Rights</h2>
            <p>Under the Australian Privacy Principles, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Request access to the personal information we hold about you
              </li>
              <li>Request correction of inaccurate or outdated information</li>
              <li>Opt out of marketing communications at any time</li>
              <li>
                Lodge a complaint if you believe your privacy has been breached
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the details
              below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">9. Retention</h2>
            <p>
              We retain personal information for as long as necessary to fulfil
              the purposes for which it was collected, comply with legal
              obligations, and support ongoing service relationships. Service
              records may be retained for the lifespan of installed equipment to
              support warranty and maintenance history.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date. We
              encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">11. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or how
              we handle your personal information, please contact us:
            </p>
            <ul className="list-none space-y-1">
              <li>
                <strong>Phone:</strong> 1300 227 600
              </li>
              <li>
                <strong>Email:</strong> admin@shelair.com.au
              </li>
              <li>
                <strong>Address:</strong> Brisbane, SE Queensland
              </li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
