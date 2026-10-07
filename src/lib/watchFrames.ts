export const FRAME_COUNT = 100;

export const getFrameUrl = (index: number): string => {
  const clamped = Math.max(1, Math.min(FRAME_COUNT, Math.round(index)));
  const frame = String(clamped).padStart(3, "0");

  return `https://res.cloudinary.com/z08v8we6/image/upload/v1791334500/frame-${frame}.webp`;
};

interface CachedFrame {
  img: HTMLImageElement;
  loaded: boolean;
  failed: boolean;
}

const frameCache: Map<number, CachedFrame> = new Map();
let isPreloadingStarted = false;
const listeners: Set<(loadedCount: number, firstFrameReady: boolean) => void> = new Set();
let loadedCount = 0;
let firstFrameReady = false;

function notifyListeners() {
  listeners.forEach((cb) => cb(loadedCount, firstFrameReady));
}

function loadSingleFrame(index: number): Promise<CachedFrame> {
  const existing = frameCache.get(index);
  if (existing && (existing.loaded || existing.failed)) {
    return Promise.resolve(existing);
  }
  if (existing) {
    return new Promise((resolve) => {
      const prevOnLoad = existing.img.onload;
      const prevOnError = existing.img.onerror;
      existing.img.onload = (ev) => {
        if (typeof prevOnLoad === "function") prevOnLoad.call(existing.img, ev);
        resolve(existing);
      };
      existing.img.onerror = (ev) => {
        if (typeof prevOnError === "function") prevOnError.call(existing.img, ev);
        resolve(existing);
      };
    });
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    const entry: CachedFrame = { img, loaded: false, failed: false };
    frameCache.set(index, entry);

    img.onload = () => {
      entry.loaded = true;
      loadedCount += 1;
      if (index === 1) {
        firstFrameReady = true;
      }
      notifyListeners();
      resolve(entry);
    };

    img.onerror = () => {
      entry.failed = true;
      loadedCount += 1;
      if (index === 1) {
        firstFrameReady = true;
      }
      notifyListeners();
      resolve(entry);
    };

    img.src = getFrameUrl(index);
  });
}

/**
 * Prioritizes frame-001 immediately, then progressively preloads frames 002..100
 * in small concurrent batches without blocking main thread responsiveness.
 */
export function preloadWatchFrames(
  onProgress?: (loaded: number, firstReady: boolean) => void
): () => void {
  if (onProgress) {
    listeners.add(onProgress);
    onProgress(loadedCount, firstFrameReady);
  }

  if (!isPreloadingStarted) {
    isPreloadingStarted = true;

    (async () => {
      // 1. Prioritize frame-001 immediately
      await loadSingleFrame(1);

      // 2. Load key scrub milestones next (every 10th frame) for immediate scrubbing responsiveness
      const milestoneIndices: number[] = [];
      for (let i = 10; i <= FRAME_COUNT; i += 10) {
        milestoneIndices.push(i);
      }
      await Promise.all(milestoneIndices.map((idx) => loadSingleFrame(idx)));

      // 3. Progressively preload remaining frames in batches of 6
      const remaining: number[] = [];
      for (let i = 2; i <= FRAME_COUNT; i++) {
        if (!frameCache.has(i)) {
          remaining.push(i);
        }
      }

      const BATCH_SIZE = 6;
      for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
        const batch = remaining.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map((idx) => loadSingleFrame(idx)));
      }
    })();
  }

  return () => {
    if (onProgress) {
      listeners.delete(onProgress);
    }
  };
}

/**
 * Returns the requested frame image if loaded, or the nearest available loaded frame.
 */
export function getBestAvailableFrame(targetIndex: number): HTMLImageElement | null {
  const clamped = Math.max(1, Math.min(FRAME_COUNT, Math.round(targetIndex)));
  const exact = frameCache.get(clamped);
  if (exact && exact.loaded && exact.img.naturalWidth > 0) {
    return exact.img;
  }

  // Search outward for nearest loaded frame
  for (let offset = 1; offset < FRAME_COUNT; offset++) {
    const prev = clamped - offset;
    if (prev >= 1) {
      const f = frameCache.get(prev);
      if (f && f.loaded && f.img.naturalWidth > 0) return f.img;
    }
    const next = clamped + offset;
    if (next <= FRAME_COUNT) {
      const f = frameCache.get(next);
      if (f && f.loaded && f.img.naturalWidth > 0) return f.img;
    }
  }

  return null;
}

/**
 * Renders the target frame onto the provided 2D canvas context.
 * Uses the exact Cloudinary WebP frame when loaded, and provides a high-precision
 * cinematic horological canvas render if frames are still in transit or unreachable.
 */
export function renderWatchFrameOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameIndex: number
) {
  ctx.clearRect(0, 0, width, height);

  // Ambient studio backdrop
  const bgGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.48,
    Math.min(width, height) * 0.05,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.75
  );
  bgGrad.addColorStop(0, "#171614");
  bgGrad.addColorStop(0.55, "#0D0D0E");
  bgGrad.addColorStop(1, "#080809");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  const img = getBestAvailableFrame(frameIndex);

  if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawWidth: number;
    let drawHeight: number;

    // Cover/contain adaptive blend so watch dominates without cropping vital details
    if (canvasAspect > imgAspect) {
      drawHeight = height * 0.96;
      drawWidth = drawHeight * imgAspect;
      if (drawWidth < width * 0.65) {
        drawWidth = width * 0.78;
        drawHeight = drawWidth / imgAspect;
      }
    } else {
      drawWidth = width * 0.95;
      drawHeight = drawWidth / imgAspect;
    }

    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  } else {
    // High-precision procedural horological sequence for frames 1..100
    drawProceduralLuxuryWatchFrame(ctx, width, height, frameIndex);
  }

  // Subtle cinematic edge vignette so overlay typography always has >= 4.5:1 contrast
  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    Math.min(width, height) * 0.28,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.72
  );
  vignette.addColorStop(0, "rgba(10, 10, 11, 0)");
  vignette.addColorStop(0.75, "rgba(10, 10, 11, 0.35)");
  vignette.addColorStop(1, "rgba(10, 10, 11, 0.82)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Renders a 100-frame scroll-driven 3D-projected mechanical luxury timepiece
 * directly on the canvas so that every scroll increment (frame 001 -> 100)
 * produces smooth, deterministic cinematic motion even before remote assets finish.
 */
function drawProceduralLuxuryWatchFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameIndex: number
) {
  const progress = (Math.max(1, Math.min(FRAME_COUNT, frameIndex)) - 1) / (FRAME_COUNT - 1);
  const cx = width * 0.5;
  const cy = height * 0.5;
  const baseRadius = Math.min(width, height) * (width < 640 ? 0.31 : 0.27);

  // Subtle camera zoom and 3D perspective tilt driven by frame 1..100
  const scale = 0.92 + Math.sin(progress * Math.PI) * 0.14 + progress * 0.06;
  const tiltX = Math.cos(progress * Math.PI * 1.15) * 0.16; // -0.16 to +0.16
  const lightAngle = -Math.PI * 0.65 + progress * Math.PI * 1.4;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale * (1 - Math.abs(tiltX) * 0.18), scale);

  // Ambient champagne halo behind watch case
  const halo = ctx.createRadialGradient(
    Math.cos(lightAngle) * baseRadius * 0.3,
    Math.sin(lightAngle) * baseRadius * 0.3,
    baseRadius * 0.2,
    0,
    0,
    baseRadius * 1.85
  );
  halo.addColorStop(0, "rgba(198, 168, 124, 0.16)");
  halo.addColorStop(0.5, "rgba(198, 168, 124, 0.04)");
  halo.addColorStop(1, "rgba(10, 10, 11, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius * 1.85, 0, Math.PI * 2);
  ctx.fill();

  // Top & Bottom Alligator Leather Strap with stitched edge
  const strapWidth = baseRadius * 0.96;
  const strapHeight = baseRadius * 1.75;
  const drawStrap = (isTop: boolean) => {
    ctx.save();
    const yStart = isTop ? -baseRadius * 0.85 : baseRadius * 0.85;
    const yEnd = isTop ? -baseRadius * 2.25 : baseRadius * 2.25;
    const strapGrad = ctx.createLinearGradient(-strapWidth * 0.5, 0, strapWidth * 0.5, 0);
    strapGrad.addColorStop(0, "#09090A");
    strapGrad.addColorStop(0.25, "#191716");
    strapGrad.addColorStop(0.5, "#23201E");
    strapGrad.addColorStop(0.75, "#161514");
    strapGrad.addColorStop(1, "#080809");

    ctx.fillStyle = strapGrad;
    ctx.beginPath();
    if (isTop) {
      ctx.moveTo(-strapWidth * 0.52, yStart);
      ctx.lineTo(-strapWidth * 0.42, yEnd);
      ctx.lineTo(strapWidth * 0.42, yEnd);
      ctx.lineTo(strapWidth * 0.52, yStart);
    } else {
      ctx.moveTo(-strapWidth * 0.52, yStart);
      ctx.lineTo(-strapWidth * 0.42, yEnd);
      ctx.lineTo(strapWidth * 0.42, yEnd);
      ctx.lineTo(strapWidth * 0.52, yStart);
    }
    ctx.closePath();
    ctx.fill();

    // Subtle alligator texture ridges
    ctx.strokeStyle = "rgba(198, 168, 124, 0.07)";
    ctx.lineWidth = 1;
    for (let r = 1; r <= 5; r++) {
      const ry = yStart + (yEnd - yStart) * (r / 6);
      ctx.beginPath();
      ctx.moveTo(-strapWidth * 0.4, ry);
      ctx.lineTo(strapWidth * 0.4, ry);
      ctx.stroke();
    }
    ctx.restore();
  };
  drawStrap(true);
  drawStrap(false);

  // Sculpted Lugs
  const drawLug = (xDir: number, yDir: number) => {
    ctx.save();
    const lugGrad = ctx.createLinearGradient(
      xDir * baseRadius * 0.4,
      yDir * baseRadius * 0.7,
      xDir * baseRadius * 0.82,
      yDir * baseRadius * 1.25
    );
    lugGrad.addColorStop(0, "#8E795E");
    lugGrad.addColorStop(0.45, "#DFC8A6");
    lugGrad.addColorStop(1, "#3A3127");
    ctx.fillStyle = lugGrad;
    ctx.beginPath();
    ctx.moveTo(xDir * baseRadius * 0.46, yDir * baseRadius * 0.78);
    ctx.quadraticCurveTo(
      xDir * baseRadius * 0.78,
      yDir * baseRadius * 0.92,
      xDir * baseRadius * 0.62,
      yDir * baseRadius * 1.28
    );
    ctx.lineTo(xDir * baseRadius * 0.47, yDir * baseRadius * 1.24);
    ctx.quadraticCurveTo(
      xDir * baseRadius * 0.52,
      yDir * baseRadius * 0.98,
      xDir * baseRadius * 0.36,
      yDir * baseRadius * 0.85
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  drawLug(-1, -1);
  drawLug(1, -1);
  drawLug(-1, 1);
  drawLug(1, 1);

  // Knurled Winding Crown at 3 o'clock
  ctx.save();
  const crownX = baseRadius * 1.03 + tiltX * baseRadius * 0.12;
  const crownW = baseRadius * 0.14;
  const crownH = baseRadius * 0.26;
  const crownGrad = ctx.createLinearGradient(crownX, -crownH * 0.5, crownX, crownH * 0.5);
  crownGrad.addColorStop(0, "#4B3F30");
  crownGrad.addColorStop(0.3, "#E6D2B5");
  crownGrad.addColorStop(0.5, "#C6A87C");
  crownGrad.addColorStop(0.8, "#8A7253");
  crownGrad.addColorStop(1, "#2A241C");
  ctx.fillStyle = crownGrad;
  ctx.beginPath();
  ctx.roundRect(crownX - crownW * 0.3, -crownH * 0.5, crownW, crownH, 3);
  ctx.fill();
  // Crown ridges
  ctx.strokeStyle = "rgba(15, 14, 12, 0.55)";
  ctx.lineWidth = 1.2;
  for (let i = -4; i <= 4; i++) {
    const ry = (i / 5) * (crownH * 0.45);
    ctx.beginPath();
    ctx.moveTo(crownX - crownW * 0.2, ry);
    ctx.lineTo(crownX + crownW * 0.65, ry);
    ctx.stroke();
  }
  ctx.restore();

  // 3D Case Depth Side Rim (shifts with tiltX)
  ctx.save();
  ctx.translate(tiltX * baseRadius * 0.18, 0);
  const rimGrad = ctx.createLinearGradient(
    Math.cos(lightAngle) * baseRadius,
    Math.sin(lightAngle) * baseRadius,
    -Math.cos(lightAngle) * baseRadius,
    -Math.sin(lightAngle) * baseRadius
  );
  rimGrad.addColorStop(0, "#F0DFC8");
  rimGrad.addColorStop(0.28, "#C6A87C");
  rimGrad.addColorStop(0.62, "#594A38");
  rimGrad.addColorStop(1, "#1D1914");
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius * 1.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Outer Brushed 18k Champagne Gold Bezel
  const bezelGrad = ctx.createConicGradient(lightAngle, 0, 0);
  bezelGrad.addColorStop(0, "#EFE0CA");
  bezelGrad.addColorStop(0.15, "#C6A87C");
  bezelGrad.addColorStop(0.35, "#4E4132");
  bezelGrad.addColorStop(0.5, "#9C8464");
  bezelGrad.addColorStop(0.68, "#2C251D");
  bezelGrad.addColorStop(0.85, "#D8C09E");
  bezelGrad.addColorStop(1, "#EFE0CA");

  ctx.fillStyle = bezelGrad;
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
  ctx.fill();

  // Inner Stepped Bezel Ring
  ctx.strokeStyle = "rgba(255, 244, 224, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius * 0.91, 0, Math.PI * 2);
  ctx.stroke();

  // Deep Anthracite Guilloché Sunray Dial
  const dialRadius = baseRadius * 0.89;
  const dialGrad = ctx.createRadialGradient(
    Math.cos(lightAngle) * dialRadius * 0.25,
    Math.sin(lightAngle) * dialRadius * 0.25,
    dialRadius * 0.04,
    0,
    0,
    dialRadius
  );
  dialGrad.addColorStop(0, "#272523");
  dialGrad.addColorStop(0.45, "#151413");
  dialGrad.addColorStop(0.85, "#0C0C0D");
  dialGrad.addColorStop(1, "#060607");

  ctx.fillStyle = dialGrad;
  ctx.beginPath();
  ctx.arc(0, 0, dialRadius, 0, Math.PI * 2);
  ctx.fill();

  // Subtle Sunray & Concentric Guilloche Rings
  ctx.strokeStyle = "rgba(198, 168, 124, 0.06)";
  ctx.lineWidth = 0.75;
  for (let r = 0.25; r <= 0.82; r += 0.08) {
    ctx.beginPath();
    ctx.arc(0, 0, dialRadius * r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Minute Railway Track & Applied Gold Baton Indices
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI) / 30 - Math.PI / 2;
    const isHour = i % 5 === 0;
    ctx.save();
    ctx.rotate(angle);
    if (isHour) {
      // Skip 6 o'clock baton where the open tourbillon bridge sits
      if (i !== 30) {
        const idxGrad = ctx.createLinearGradient(dialRadius * 0.73, -3, dialRadius * 0.86, 3);
        idxGrad.addColorStop(0, "#F5E6CE");
        idxGrad.addColorStop(0.5, "#C6A87C");
        idxGrad.addColorStop(1, "#6E5A40");
        ctx.fillStyle = idxGrad;
        const batonW = i === 0 ? dialRadius * 0.14 : dialRadius * 0.12;
        const batonH = i === 0 ? 4.5 : 3;
        ctx.beginPath();
        ctx.roundRect(dialRadius * 0.73, -batonH * 0.5, batonW, batonH, 1);
        ctx.fill();
      }
    } else {
      ctx.strokeStyle = "rgba(245, 243, 239, 0.28)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(dialRadius * 0.83, 0);
      ctx.lineTo(dialRadius * 0.86, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Dial Typography: PATRICK HOSKINS / CHICAGO
  ctx.save();
  ctx.fillStyle = "#EAE4DC";
  ctx.font = `500 ${Math.max(9, Math.round(baseRadius * 0.068))}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = "center";
  ctx.letterSpacing = "3px";
  ctx.fillText("PATRICK HOSKINS", 0, -dialRadius * 0.42);

  ctx.fillStyle = "rgba(198, 168, 124, 0.78)";
  ctx.font = `400 ${Math.max(6, Math.round(baseRadius * 0.036))}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText("CHRONOMÈTRE · OAK STREET", 0, -dialRadius * 0.31);
  ctx.restore();

  // Open-Worked Flying Tourbillon Aperture at 6 o'clock (rotates with frameIndex!)
  const tourbY = dialRadius * 0.42;
  const tourbR = dialRadius * 0.24;
  ctx.save();
  ctx.translate(0, tourbY);

  // Deep aperture recess
  const recessGrad = ctx.createRadialGradient(0, 0, tourbR * 0.1, 0, 0, tourbR);
  recessGrad.addColorStop(0, "#050506");
  recessGrad.addColorStop(0.8, "#0B0B0D");
  recessGrad.addColorStop(1, "#2A241D");
  ctx.fillStyle = recessGrad;
  ctx.beginPath();
  ctx.arc(0, 0, tourbR, 0, Math.PI * 2);
  ctx.fill();

  // Exposed Gold Gear Train inside aperture
  const cageRotation = progress * Math.PI * 6;
  ctx.save();
  ctx.rotate(cageRotation);
  ctx.strokeStyle = "#C6A87C";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, tourbR * 0.74, 0, Math.PI * 2);
  ctx.stroke();

  for (let s = 0; s < 3; s++) {
    ctx.save();
    ctx.rotate((s * Math.PI * 2) / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(tourbR * 0.74, 0);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // Center synthetic ruby jewel
  ctx.fillStyle = "#B8334A";
  ctx.beginPath();
  ctx.arc(0, 0, tourbR * 0.13, 0, Math.PI * 2);
  ctx.fill();

  // Horizontal hand-beveled tourbillon bridge
  ctx.strokeStyle = "#E6D2B5";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-tourbR * 1.15, 0);
  ctx.lineTo(tourbR * 1.15, 0);
  ctx.stroke();
  ctx.restore();

  // Dauphine Faceted Hands (sweeping subtly across the 100 frames around 10:10)
  const hourAngle = -Math.PI * 0.84 + progress * 0.22;
  const minuteAngle = -Math.PI * 0.18 + progress * 1.35;
  const secondAngle = -Math.PI * 0.5 + progress * Math.PI * 3.2;

  const drawDauphineHand = (angle: number, length: number, tail: number, widthPx: number) => {
    ctx.save();
    ctx.rotate(angle);
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // Upper lit facet
    ctx.fillStyle = "#F5E7D0";
    ctx.beginPath();
    ctx.moveTo(-tail, 0);
    ctx.lineTo(0, -widthPx);
    ctx.lineTo(length, 0);
    ctx.closePath();
    ctx.fill();

    // Lower shaded facet
    ctx.fillStyle = "#9E825C";
    ctx.beginPath();
    ctx.moveTo(-tail, 0);
    ctx.lineTo(0, widthPx);
    ctx.lineTo(length, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawDauphineHand(hourAngle, dialRadius * 0.52, dialRadius * 0.1, 5.5);
  drawDauphineHand(minuteAngle, dialRadius * 0.76, dialRadius * 0.13, 4.2);

  // Counterweighted sweeping seconds hand
  ctx.save();
  ctx.rotate(secondAngle);
  ctx.strokeStyle = "#DFC59B";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-dialRadius * 0.18, 0);
  ctx.lineTo(dialRadius * 0.81, 0);
  ctx.stroke();
  ctx.fillStyle = "#DFC59B";
  ctx.beginPath();
  ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Domed Sapphire Crystal Anti-Reflective Glint (sweeps across dial with scroll)
  const glintShift = (progress - 0.5) * dialRadius * 1.1;
  const crystalGrad = ctx.createLinearGradient(
    -dialRadius + glintShift,
    -dialRadius,
    dialRadius * 0.6 + glintShift,
    dialRadius
  );
  crystalGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  crystalGrad.addColorStop(0.45, "rgba(255, 255, 255, 0.01)");
  crystalGrad.addColorStop(0.5, "rgba(220, 232, 255, 0.08)");
  crystalGrad.addColorStop(0.55, "rgba(255, 255, 255, 0.01)");
  crystalGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = crystalGrad;
  ctx.beginPath();
  ctx.arc(0, 0, dialRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
