import { useTranslation } from "react-i18next";
import { blogBackgroundStyle } from "../styles/blogBackground";
import useIsDesktop from "../hooks/useIsDesktop";

function Blog() {
  const { t } = useTranslation();
  const isDesktop = useIsDesktop();
  const isWide = useIsDesktop(1440);

  const topics = [
    {
      title: t("blogTopic1Title", { defaultValue: "Сезонные коллекции" }),
      text: t("blogTopic1Desc", {
        defaultValue: "Новые вкусы, лимитированные наборы и календарь заказов.",
      }),
    },
    {
      title: t("blogTopic2Title", { defaultValue: "Закулисье производства" }),
      text: t("blogTopic2Desc", {
        defaultValue: "Ингредиенты, ремесленные процессы и шоколадная философия.",
      }),
    },
    {
      title: t("blogTopic3Title", { defaultValue: "Идеи для подарков" }),
      text: t("blogTopic3Desc", {
        defaultValue: "Сценарии для праздников, корпоративные подарки и личные поводы.",
      }),
    },
  ];

  const mediaGradient = {
    background:
      "linear-gradient(135deg, #4a141b 0%, #6e2331 45%, #8f2f43 70%, #a5435b 100%)",
  };

  const posts = [
    {
      label: t("blogFirstPostLabel", { defaultValue: "Первый пост" }),
      date: t("blogFirstPostDate", { defaultValue: "14 февраля 2026" }),
      title: t("blogFirstPostTitle", { defaultValue: "День влюблённых с Amuerose" }),
      intro: t("blogFirstPostIntro", {
        defaultValue:
          "День святого Валентина уже близко — и мы представляем особенную коллекцию сладостей.",
      }),
      body1: t("blogFirstPostBody1", {
        defaultValue:
          "В этом сезоне мы подготовили лимитированные валентинские наборы: премиальные ягоды в бельгийском шоколаде, авторские сочетания и подарочное оформление, которое говорит за вас.",
      }),
      body2: t("blogFirstPostBody2", {
        defaultValue:
          "Количество наборов ограничено, поэтому рекомендуем оформить заказ заранее. Это наш первый пост, и мы рады делиться вдохновением вместе с вами.",
      }),
      tags: [
        t("blogFirstPostTag1", { defaultValue: "Valentine" }),
        t("blogFirstPostTag2", { defaultValue: "Limited" }),
        t("blogFirstPostTag3", { defaultValue: "Gift" }),
      ],
    },
    {
      label: t("blogPost2Label", { defaultValue: "Второй пост" }),
      date: t("blogPost2Date", { defaultValue: "13 февраля 2026" }),
      title: t("blogPost2Title", { defaultValue: "Подарочные наборы для неё и для него" }),
      intro: t("blogPost2Intro", {
        defaultValue:
          "Тонкий вкус, мягкие акценты и идеальные пары — всё, чтобы подарок говорил за вас.",
      }),
      body1: t("blogPost2Body1", {
        defaultValue:
          "Мы подготовили сценарии для романтического вечера: клубника в белом и молочном шоколаде, авторские начинки и открытки с подписью.",
      }),
      body2: t("blogPost2Body2", {
        defaultValue:
          "Каждый набор можно персонализировать — от оттенка ленты до короткого послания.",
      }),
      tags: [
        t("blogPost2Tag1", { defaultValue: "Valentine" }),
        t("blogPost2Tag2", { defaultValue: "Packaging" }),
        t("blogPost2Tag3", { defaultValue: "Personal" }),
      ],
    },
    {
      label: t("blogPost3Label", { defaultValue: "Третий пост" }),
      date: t("blogPost3Date", { defaultValue: "12 февраля 2026" }),
      title: t("blogPost3Title", { defaultValue: "Последние слоты на доставку" }),
      intro: t("blogPost3Intro", {
        defaultValue:
          "Валентинская неделя всегда насыщенная — рассказываем, как успеть с заказом.",
      }),
      body1: t("blogPost3Body1", {
        defaultValue:
          "Мы доставляем наборы по Праге в удобные окна. Чем раньше оформите заказ, тем больше свободных слотов.",
      }),
      body2: t("blogPost3Body2", {
        defaultValue:
          "Для срочных заказов пишите нам — поможем подобрать идеальный вариант.",
      }),
      tags: [
        t("blogPost3Tag1", { defaultValue: "Delivery" }),
        t("blogPost3Tag2", { defaultValue: "Limited" }),
        t("blogPost3Tag3", { defaultValue: "Last Call" }),
      ],
    },
  ];
  const mobilePost = posts[0];

  return (
    <div
      className="relative h-[100dvh] overflow-hidden text-[#4B2E1D]"
      style={blogBackgroundStyle}
    >
      <div
        className="absolute -top-20 right-[-10%] w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-[#BDA47A]/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-12%] left-[-6%] w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full bg-[#9E7D57]/15 blur-3xl"
        aria-hidden="true"
      />

      {isDesktop ? (
        <div
          className={`relative h-full mx-auto pt-[calc(90px+var(--safe-area-inset-top,0px))] pb-[calc(64px+var(--safe-area-inset-bottom,0px))] ${
            isWide ? "max-w-[1500px] px-10 2xl:px-12" : "max-w-6xl px-6"
          }`}
        >
          {isWide ? (
            <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-7">
              <header className="flex items-end justify-between gap-8">
                <div className="flex flex-col gap-2">
                  <span className="w-fit px-4 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-xl text-xs uppercase tracking-[0.28em] text-[#BDA47A]">
                    {t("blogBadge", { defaultValue: "Дневник Amuerose" })}
                  </span>
                  <h1 className="text-5xl font-[Inter] font-semibold text-[#BDA47A] drop-shadow">
                    {t("blogTitle", { defaultValue: "Блог Amuerose" })}
                  </h1>
                  <p className="max-w-2xl text-base text-[#4B2E1D]/80">
                    {t("blogSubtitle", {
                      defaultValue: "Истории, сезонные коллекции и вдохновение для сладких моментов.",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end text-xs uppercase tracking-[0.28em] text-[#BDA47A]">
                  <span>{t("blogIssueLabel", { defaultValue: "Выпуск 01 · февраль 2026" })}</span>
                </div>
              </header>

              <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(0,0.45fr)] gap-8">
                <div className="min-h-0 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex flex-col gap-5 pb-2">
                    {posts.map((post, index) => (
                      <article
                        key={`${post.title}-wide-${index}`}
                        className="grid grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] gap-5 items-stretch"
                      >
                        <div
                          className="rounded-[24px] border border-white/30 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_14px_32px_rgba(0,0,0,0.12)] min-h-[220px]"
                          style={mediaGradient}
                        />
                        <div className="rounded-[24px] border border-white/30 bg-[rgba(255,255,255,0.12)] backdrop-blur-[26px] px-6 py-5 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_12px_32px_rgba(0,0,0,0.12)]">
                          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[#BDA47A]">
                            <span>{post.label}</span>
                            <span className="text-[#4B2E1D]/70">{post.date}</span>
                          </div>
                          <h2 className="mt-3 text-2xl font-semibold text-[#4B2E1D]">
                            {post.title}
                          </h2>
                          <p className="mt-3 text-sm text-[#4B2E1D]/85 leading-snug">
                            {post.intro}
                          </p>
                          <div className="mt-3 space-y-2 text-sm text-[#4B2E1D]/80">
                            <p className="leading-snug">{post.body1}</p>
                            <p className="leading-snug">{post.body2}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
                  <div className="rounded-[20px] border border-white/30 bg-white/10 backdrop-blur-[18px] px-4 py-4 text-[#4B2E1D] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_8px_18px_rgba(0,0,0,0.08)]">
                    <p className="text-xs text-[#4B2E1D]/80">
                      {t("blogSubtitle", {
                        defaultValue: "Истории, сезонные коллекции и вдохновение для сладких моментов.",
                      })}
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/30 bg-[rgba(255,255,255,0.12)] backdrop-blur-[22px] px-4 py-4 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_10px_24px_rgba(0,0,0,0.1)]">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#BDA47A]">
                      {t("blogTopicsTitle", { defaultValue: "О чем пишем" })}
                    </p>
                    <ul className="mt-4 space-y-3 text-xs text-[#4B2E1D]/80">
                      {topics.map((topic, index) => (
                        <li key={`${topic.title}-${index}`}>
                          <span className="font-semibold text-[#4B2E1D]">{topic.title}</span>
                          <p className="mt-1 text-[11px] text-[#4B2E1D]/70">{topic.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            </div>
          ) : (
            <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-6">
              <header className="flex items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <span className="w-fit px-4 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-xl text-xs uppercase tracking-[0.28em] text-[#BDA47A]">
                    {t("blogBadge", { defaultValue: "Дневник Amuerose" })}
                  </span>
                  <h1 className="text-4xl font-[Inter] font-semibold text-[#BDA47A] drop-shadow">
                    {t("blogTitle", { defaultValue: "Блог Amuerose" })}
                  </h1>
                  <p className="max-w-2xl text-base text-[#4B2E1D]/80">
                    {t("blogSubtitle", {
                      defaultValue: "Истории, сезонные коллекции и вдохновение для сладких моментов.",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end text-xs uppercase tracking-[0.28em] text-[#BDA47A]">
                  <span>{t("blogIssueLabel", { defaultValue: "Выпуск 01 · февраль 2026" })}</span>
                </div>
              </header>

              <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-4">
                <div className="min-h-0 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex flex-col gap-5 pb-2">
                    {posts.map((post, index) => (
                      <article
                        key={`${post.title}-mid-${index}`}
                        className="grid grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] gap-5 items-stretch"
                      >
                        <div
                          className="rounded-[22px] border border-white/30 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_12px_28px_rgba(0,0,0,0.12)] min-h-[200px]"
                          style={mediaGradient}
                        />
                        <div className="rounded-[24px] border border-white/30 bg-[rgba(255,255,255,0.12)] backdrop-blur-[26px] px-6 py-5 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_12px_32px_rgba(0,0,0,0.12)]">
                          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[#BDA47A]">
                            <span>{post.label}</span>
                            <span className="text-[#4B2E1D]/70">{post.date}</span>
                          </div>
                          <h2 className="mt-3 text-2xl font-semibold text-[#4B2E1D]">
                            {post.title}
                          </h2>
                          <p className="mt-3 text-sm text-[#4B2E1D]/85 leading-snug">
                            {post.intro}
                          </p>
                          <div className="mt-3 space-y-2 text-sm text-[#4B2E1D]/80">
                            <p className="leading-snug">{post.body1}</p>
                            <p className="leading-snug">{post.body2}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {topics.map((topic, index) => (
                    <div
                      key={`${topic.title}-${index}`}
                      className="rounded-[18px] border border-white/30 bg-[rgba(255,255,255,0.08)] backdrop-blur-[24px] px-4 py-3 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_6px_18px_rgba(0,0,0,0.08)]"
                    >
                      <h3 className="text-sm font-semibold text-[#BDA47A]">
                        {topic.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-[#4B2E1D]/75">
                        {topic.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-full max-w-md mx-auto px-4 pt-[calc(90px+var(--safe-area-inset-top,0px))] pb-[calc(140px+var(--safe-area-inset-bottom,0px))]">
          <div className="flex flex-col h-full gap-3">
            <header className="flex flex-col gap-2">
              <span className="w-fit px-4 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-xl text-[9px] uppercase tracking-[0.28em] text-[#BDA47A]">
                {t("blogBadge", { defaultValue: "Дневник Amuerose" })}
              </span>
              <h1 className="text-2xl font-[Inter] font-semibold text-[#BDA47A] drop-shadow">
                {t("blogTitle", { defaultValue: "Блог Amuerose" })}
              </h1>
              <p className="text-xs text-[#4B2E1D]/80">
                {t("blogSubtitle", {
                  defaultValue: "Истории, сезонные коллекции и вдохновение для сладких моментов.",
                })}
              </p>
            </header>

            <div className="flex-1 min-h-0 flex flex-col gap-3">
              <div
                className="rounded-[26px] border border-white/30 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_14px_36px_rgba(0,0,0,0.12)] aspect-[4/5] max-h-[38vh]"
                style={mediaGradient}
              />

              <div className="rounded-[24px] border border-white/30 bg-[rgba(255,255,255,0.12)] backdrop-blur-[26px] px-4 py-4 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_12px_32px_rgba(0,0,0,0.12)]">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.28em] text-[#BDA47A]">
                  <span>{mobilePost.label}</span>
                  <span className="text-[#4B2E1D]/70">{mobilePost.date}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-[#4B2E1D]">
                  {mobilePost.title}
                </h2>
                <p className="mt-2 text-[11px] text-[#4B2E1D]/85 leading-snug">
                  {mobilePost.intro}
                </p>
                <p className="mt-2 text-[11px] text-[#4B2E1D]/80 leading-snug">
                  {mobilePost.body1}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {mobilePost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full border border-white/30 bg-white/10 text-[10px] uppercase tracking-[0.2em] text-[#BDA47A]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
