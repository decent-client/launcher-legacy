"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
// import { SparklesCore } from "@/components/ui/motion/sparkles";
// import { useLauncherLayout } from "@/lib/providers/launcher-layout";
import { cn } from "~/lib/utils";

import SkinView3D from "~/components/skin-viewer";
import { useLauncherLayout } from "~/lib/providers/launcher-layout";

const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);

export function LauncherCard({ className }: Readonly<{ className?: string }>) {
  const { launcherLayout } = useLauncherLayout();

  const {
    newsFeed: { scrollY },
  } = launcherLayout;

  return (
    <MotionCard
      className={cn("relative grid rounded-lg bg-center", className)}
      style={{
        backgroundImage: "url(/images/launcher-background.png)",
      }}
      initial={{ height: "16rem" }}
      animate={{
        height: scrollY > 0 ? "5rem" : "16rem",
        // minHeight: collapseLauncherCard ? "5rem" : "16rem",
        backgroundSize: scrollY > 0 ? "150%" : "100%",
      }}
      whileHover={{
        backgroundSize: scrollY > 0 ? "155%" : "105%",
      }}
      transition={{
        bounce: 0,
        duration: 0.3,
      }}
    >
      <Backdrop />
      <article className="relative overflow-hidden z-10 grid place-items-center">
        <motion.div
          className="absolute bg-transparent"
          animate={{
            bottom: scrollY > 0 ? "-12rem" : "-4rem",
            scale: scrollY > 0 ? 0.75 : 1,
            opacity: scrollY > 0 ? 0 : 1,
          }}
          transition={{
            bounce: 0,
          }}
        >
          <SkinView3D
            skinUrl="https://textures.minecraft.net/texture/62ef03bef2855ec18c29e8d555df0f9a7718fb4fd609de3b9ff64b4d6ea87fbe"
            height={256 * 1.25}
            width={256}
            onReady={({ viewer }) => {
              viewer.fov = 35;
              viewer.camera.position.x = 22 * Math.sin(0.01) - 20;
              viewer.camera.position.y = 22 * Math.sin(0.01) + 15;
              viewer.controls.enableZoom = false;
              viewer.controls.enablePan = false;
            }}
          />
        </motion.div>
        <LaunchButton center={scrollY > 0} />
      </article>
    </MotionCard>
  );
}

function LaunchButton({
  center,
}: Readonly<{
  center: boolean;
}>) {
  return (
    <MotionButton
      className="absolute flex items-center hover:scale-[1.0175] active:scale-[0.975] transition-transform gap-x-4 h-auto pl-5 py-2.5 pr-7 rounded-xl"
      animate={{
        marginTop: center ? "0" : "9rem",
      }}
      variant={"outline"}
    >
      <Rocket className="stroke-blue-500" size={36} strokeWidth={1.75} />
      <div className="text-left whitespace-nowrap text-foreground flex flex-col">
        <h1 className="font-mono text-lg font-bold leading-5 tracking-tight">
          Launch Minecraft
        </h1>
        <p className="leading-4 text-muted-foreground font-sans text-xs italic tracking-wide">
          on game version 1.8.9
        </p>
      </div>
    </MotionButton>
  );
}

function Backdrop() {
  return (
    <div className="absolute rounded-[inherit]  inset-0 overflow-hidden">
      {/* <SparklesCore
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="absolute inset-0 blur-sm"
        particleColor="#FFFFFF"
      /> */}
      <span className="pointer-events-none absolute  inset-0 rounded-[inherit] backdrop-blur-sm" />
      {/* <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/jkiOe6OSWymmKUMb/scene.splinecode" />
        <div className="absolute inset-0  opacity-20 mix-blend-multiply z-0" />
      </div> */}
      {/* <span className="pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-[2px]" /> */}
    </div>
  );
}
