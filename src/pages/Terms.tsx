/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "./Layout";
import type { Lang, Dict } from "../lib/i18n";

export const Terms: FC<{ lang: Lang; dict: Dict }> = ({ lang, dict }) => {
  return (
    <Layout title={dict.termsTitle} lang={lang} dict={dict}>
      <div class="page-wrapper">
        {/* Header */}
        <header class="site-header">
          <a href="/" class="brand">{dict.siteName}</a>
          <nav class="site-nav">
            <a href="/" class="text-sm font-semibold" style="transition:color 0.2s; color:var(--text-primary);" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-primary)'">{dict.termsNavHome}</a>
          </nav>
        </header>

        {/* Content */}
        <main class="site-main--narrow">
          <div class="card" style="padding:2.5rem;">
            <h1 style="font-size:2rem; margin-bottom:2rem; color:var(--text-primary);">{dict.termsTitle}</h1>
            <p class="text-secondary" style="margin-bottom:2rem;">
              {dict.termsLastUpdated}
            </p>

            <div style="display:flex; flex-direction:column; gap:2rem;">
              <section>
                <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">{dict.termsSection1Title}</h2>
                <p class="text-secondary" style="line-height:1.7;">
                  {dict.termsSection1Body1}
                </p>
                <p class="text-secondary" style="line-height:1.7; margin-top:0.75rem;">
                  <strong>{dict.termsSection1Body2}</strong>
                </p>
              </section>

              <section>
                <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">{dict.termsSection2Title}</h2>
                <p class="text-secondary" style="line-height:1.7;">
                  {dict.termsSection2Body}
                </p>
              </section>

              <section>
                <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">{dict.termsSection3Title}</h2>
                <p class="text-secondary" style="line-height:1.7;">
                  {dict.termsSection3Body}
                </p>
              </section>

              <section>
                <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">{dict.termsSection4Title}</h2>
                <p class="text-secondary" style="line-height:1.7; margin-bottom:0.75rem;">
                  {dict.termsSection4_1}
                </p>
                <p class="text-secondary" style="line-height:1.7; margin-bottom:0.75rem;">
                  {dict.termsSection4_2}
                </p>
                <ul class="text-secondary" style="line-height:1.7; padding-left:1.5rem; margin-bottom:0.75rem;">
                  <li>{dict.termsSection4_2_list1}</li>
                  <li>{dict.termsSection4_2_list2}</li>
                  <li>{dict.termsSection4_2_list3}</li>
                </ul>
                <p class="text-secondary" style="line-height:1.7; margin-bottom:0.75rem;">
                  {dict.termsSection4_3}
                </p>
                <ul class="text-secondary" style="line-height:1.7; padding-left:1.5rem; margin-bottom:0.75rem;">
                  <li>{dict.termsSection4_3_list1}</li>
                  <li>{dict.termsSection4_3_list2}</li>
                  <li>{dict.termsSection4_3_list3}</li>
                  <li>{dict.termsSection4_3_list4}</li>
                  <li>{dict.termsSection4_3_list5}</li>
                </ul>
                <p class="text-secondary" style="line-height:1.7; margin-bottom:0.75rem;">
                  {dict.termsSection4_4}
                </p>
                <p class="text-secondary" style="line-height:1.7;">
                  {dict.termsSection4_5}
                </p>
              </section>

              <section>
                <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">{dict.termsSection5Title}</h2>
                <p class="text-secondary" style="line-height:1.7;">
                  {dict.termsSection5Body}
                </p>
              </section>

              <section>
                <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">{dict.termsSection6Title}</h2>
                <p class="text-secondary" style="line-height:1.7;">
                  {dict.termsSection6Body}
                </p>
              </section>

              <section>
                <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">{dict.termsSection7Title}</h2>
                <p class="text-secondary" style="line-height:1.7;">
                  {dict.termsSection7Body}
                </p>
              </section>

              <section>
                <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">{dict.termsSection8Title}</h2>
                <p class="text-secondary" style="line-height:1.7;">
                  {dict.termsSection8Body}
                </p>
              </section>

              <section>
                <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">{dict.termsSection9Title}</h2>
                <p class="text-secondary" style="line-height:1.7;">
                  {dict.termsSection9Body}
                </p>
              </section>

              <section>
                <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">{dict.termsSection10Title}</h2>
                <p class="text-secondary" style="line-height:1.7;" dangerouslySetInnerHTML={{ __html: dict.termsSection10Body }} />
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style="border-top:1px solid var(--border-strong); padding:2rem 1.5rem; text-align:center;">
          <p class="text-xs" style="margin:0 0 0.5rem; color:var(--text-secondary);">
            {dict.termsFooterCopyright}
          </p>
          <p class="text-xs" style="margin:0; color:var(--text-secondary);">
            {dict.termsFooterAddress}
          </p>
        </footer>
      </div>
    </Layout>
  );
};
