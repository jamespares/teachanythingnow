/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "../components/Layout";
import { Navbar } from "../components/Navbar";
import type { Lang, Dict } from "../lib/i18n";

export const Terms: FC<{ lang: Lang; dict: Dict }> = ({ lang, dict }) => {
  return (
    <Layout title={dict.termsTitle} lang={lang} dict={dict}>
      <div class="min-h-screen flex flex-col">
        <Navbar dict={dict} />

        <main class="site-main--narrow flex-1">
          <div class="card p-10">
            <h1 class="font-accent text-3xl font-normal mb-8">{dict.termsTitle}</h1>
            <p class="text-secondary mb-8">{dict.termsLastUpdated}</p>

            <div class="flex flex-col gap-8">
              <section>
                <h2 class="font-accent text-xl font-normal mb-3">{dict.termsSection1Title}</h2>
                <p class="text-secondary leading-relaxed">{dict.termsSection1Body1}</p>
                <p class="text-secondary leading-relaxed mt-3"><strong>{dict.termsSection1Body2}</strong></p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">{dict.termsSection2Title}</h2>
                <p class="text-secondary leading-relaxed">{dict.termsSection2Body}</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">{dict.termsSection3Title}</h2>
                <p class="text-secondary leading-relaxed">{dict.termsSection3Body}</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">{dict.termsSection4Title}</h2>
                <p class="text-secondary leading-relaxed mb-3">{dict.termsSection4_1}</p>
                <p class="text-secondary leading-relaxed mb-3">{dict.termsSection4_2}</p>
                <ul class="text-secondary leading-relaxed pl-6 mb-3">
                  <li>{dict.termsSection4_2_list1}</li>
                  <li>{dict.termsSection4_2_list2}</li>
                  <li>{dict.termsSection4_2_list3}</li>
                </ul>
                <p class="text-secondary leading-relaxed mb-3">{dict.termsSection4_3}</p>
                <ul class="text-secondary leading-relaxed pl-6 mb-3">
                  <li>{dict.termsSection4_3_list1}</li>
                  <li>{dict.termsSection4_3_list2}</li>
                  <li>{dict.termsSection4_3_list3}</li>
                  <li>{dict.termsSection4_3_list4}</li>
                  <li>{dict.termsSection4_3_list5}</li>
                </ul>
                <p class="text-secondary leading-relaxed mb-3">{dict.termsSection4_4}</p>
                <p class="text-secondary leading-relaxed">{dict.termsSection4_5}</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">{dict.termsSection5Title}</h2>
                <p class="text-secondary leading-relaxed">{dict.termsSection5Body}</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">{dict.termsSection6Title}</h2>
                <p class="text-secondary leading-relaxed">{dict.termsSection6Body}</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">{dict.termsSection7Title}</h2>
                <p class="text-secondary leading-relaxed">{dict.termsSection7Body}</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">{dict.termsSection8Title}</h2>
                <p class="text-secondary leading-relaxed">{dict.termsSection8Body}</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">{dict.termsSection9Title}</h2>
                <p class="text-secondary leading-relaxed">{dict.termsSection9Body}</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">{dict.termsSection10Title}</h2>
                <p class="text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: dict.termsSection10Body }} />
              </section>
            </div>
          </div>
        </main>

        <footer class="border-t-strong py-8 px-6 text-center">
          <p class="text-xs text-secondary m-0 mb-2">{dict.termsFooterCopyright}</p>
          <p class="text-xs text-secondary m-0">{dict.termsFooterAddress}</p>
        </footer>
      </div>
    </Layout>
  );
};
