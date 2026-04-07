import Layout from "@/components/Layout";
import { termsContent } from "@/data/legal";
import type { LegalPage } from "@/lib/supabase/legal";

interface Props {
  legalData?: LegalPage | null;
}

const TermsOfService = ({ legalData }: Props) => {
  if (legalData) {
    return (
      <Layout>
        <div className="container-narrow section-padding">
          {/* Header */}
          <h1 className="text-4xl font-extrabold mb-3">{legalData.title}</h1>
          {legalData.intro && (
            <p className="text-muted-foreground mb-1">{legalData.intro}</p>
          )}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground mt-3 mb-8">
            {legalData.effective_date && (
              <span>
                <strong>Effective Date:</strong> {legalData.effective_date}
              </span>
            )}
            {legalData.qbcc && (
              <span>
                <strong>QBCC Licence:</strong> #{legalData.qbcc}
              </span>
            )}
            {legalData.abn && (
              <span>
                <strong>ABN:</strong> {legalData.abn}
              </span>
            )}
          </div>

          {/* Sections */}
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

  // Static fallback
  return (
    <Layout>
      <div className="container-narrow section-padding">
        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-3">{termsContent.title}</h1>
        <p className="text-muted-foreground mb-1">{termsContent.intro}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground mt-3 mb-8">
          <span>
            <strong>Effective Date:</strong> {termsContent.effectiveDate}
          </span>
          <span>
            <strong>QBCC Licence:</strong> #{termsContent.qbcc}
          </span>
          <span>
            <strong>ABN:</strong> {termsContent.abn}
          </span>
        </div>

        {/* Sections */}
        <div className="prose prose-lg max-w-none space-y-8 text-foreground/80">
          {termsContent.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold text-foreground">
                {section.heading}
              </h2>

              {section.bodies?.map((body, i) => (
                <p key={i}>{body}</p>
              ))}

              {section.list && (
                <ul className="list-disc pl-6 space-y-2">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              {section.numberedItems && (
                <dl className="space-y-3 mt-4">
                  {section.numberedItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <dt className="font-semibold shrink-0 w-10">{item.id}</dt>
                      <dd>{item.text}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {section.contactDetails && (
                <ul className="list-none space-y-1">
                  {section.contactDetails.map((cd) => (
                    <li key={cd.label}>
                      <strong>{cd.label}:</strong> {cd.value}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
