import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

const MotionSection = lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.motion.section }))
);

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full relative overflow-hidden">
      <Suspense fallback={null}>
        <MotionSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-[100dvh] w-full bg-cover bg-center text-white"
          style={{
            backgroundImage: `url('/valentine/IMG_8518.PNG')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50 z-0" />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center gap-10">
            <p className="text-[clamp(3rem,6vw,5rem)] font-light tracking-[0.3em] uppercase drop-shadow-lg">
              Valentine collection 2026
            </p>
            <button
              onClick={() => navigate("/valentine")}
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-8 py-3 text-base font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white/10"
            >
              Перейти к коллекции
            </button>
          </div>
        </MotionSection>
      </Suspense>
    </div>
  );
}

export default Home;
