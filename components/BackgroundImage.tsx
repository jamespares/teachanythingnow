"use client";

import Image from "next/image";

export default function BackgroundImage() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-[#2d5016]">
      <Image
        src="/chalk-board-bg.png"
        alt=""
        fill
        priority
        quality={75}
        className="object-cover"
        sizes="100vw"
        unoptimized={false}
        style={{
          objectPosition: 'center',
        }}
      />
    </div>
  );
}
