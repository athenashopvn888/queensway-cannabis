"use client";

import Link from "next/link";
import { useState } from "react";
import { FLEET_COLORS } from "../../lib/fleet/config";
import type { ResolvedBanner } from "../../lib/fleet/types";
import { SHOW_CIGARETTES } from "../../lib/siteConfig";

const figureStyle = { margin: 0, width: "100%" } as const;
const imageStyle = { display: "block", width: "100%", maxWidth: "100%", height: "auto" } as const;
const linkStyle = { display: "block", width: "100%" } as const;
const captionStyle = { margin: 0, padding: "10px 14px", background: FLEET_COLORS.banner, color: FLEET_COLORS.bannerText, textAlign: "center" as const, fontWeight: 800, lineHeight: 1.35 };

function BannerFigure({ banner }: { banner: ResolvedBanner }) {
  const [src, setSrc] = useState(banner.image);
  const [imageFailed, setImageFailed] = useState(false);
  const showText = banner.render === "text" || imageFailed || !src;
  const useCodedFallback = () => {
    if (banner.codedImage && src !== banner.codedImage) {
      setSrc(banner.codedImage);
      return;
    }
    setImageFailed(true);
  };
  return (
    <figure data-core-banner={banner.id} style={figureStyle}>
      {showText ? (
        <div data-fleet-text-banner="" style={{ ...imageStyle, minHeight: banner.imageHeight || 180, display: "flex", alignItems: "center", justifyContent: "center", background: FLEET_COLORS.banner, color: FLEET_COLORS.bannerText, fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)" }}>{banner.categoryName}</div>
      ) : (
        <Link href={banner.href} style={linkStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={src}
            src={src}
            alt={banner.alt}
            title={banner.title}
            width={banner.imageWidth}
            height={banner.imageHeight}
            style={imageStyle}
            ref={(node) => {
              // useCodedFallback is a click/error handler, not a Hook.
              // eslint-disable-next-line react-hooks/rules-of-hooks
              if (node?.complete && node.naturalWidth === 0) useCodedFallback();
            }}
            onError={useCodedFallback}
          />
        </Link>
      )}
      <figcaption style={captionStyle}>{banner.textBar}</figcaption>
    </figure>
  );
}

export default function FleetAnnouncementBanner({ banners }: { banners?: ResolvedBanner[] } = {}) {
  if (!banners) return null;
  const visible = banners.filter((banner) => !banner.hidden && (SHOW_CIGARETTES || (banner.id !== "cigarettes" && banner.id !== "premium-cigarettes")));
  if (visible.length === 0) return null;
  return (
    <aside data-fleet-homepage-announcement="" aria-label="Store announcements" style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "100%", height: "auto", overflowX: "hidden", overflowY: "visible", position: "relative", zIndex: 50 }}>
      {visible.map((banner) => <BannerFigure key={banner.id} banner={banner} />)}
    </aside>
  );
}
