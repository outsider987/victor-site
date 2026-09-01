"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { homeSlides, projects, withBasePath } from "@/data/projects";
import { scrollProgress } from "./scroll-progress";

type Card = {
  group: THREE.Group;
  image: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  border: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
};

function createCard(texture: THREE.Texture): Card {
  const group = new THREE.Group();
  const border = new THREE.Mesh(
    new THREE.BoxGeometry(1.004, 0.629, 0.018),
    new THREE.MeshStandardMaterial({ color: 0x272b2f, metalness: 0, roughness: 0.92, transparent: true, depthWrite: false }),
  );
  const image = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.625),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false, depthWrite: false }),
  );
  image.position.z = 0.01;
  group.add(border, image);
  return { group, image, border };
}

export function ThreeDeck({ scrollerRef, onActiveChange, onReady }: {
  scrollerRef: RefObject<HTMLElement | null>;
  onActiveChange: (index: number) => void;
  onReady: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const scroller = scrollerRef.current;
    if (!host || !scroller) return;
    const shell = host.parentElement;

    const mobileQuery = window.matchMedia("(max-width: 820px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let anchors: number[] = [];
    let progress = 0;
    let visualProgress = 0;
    let active = -1;
    let scheduleRender: () => void = () => undefined;
    let syncVideoPlayback: () => void = () => undefined;

    const measureAnchors = () => {
      anchors = Array.from(scroller.querySelectorAll<HTMLElement>(".coverflow-section"), (section) => section.offsetTop);
    };
    const readScroll = () => {
      progress = scrollProgress(scroller.scrollTop, anchors);
      const introExit = THREE.MathUtils.smoothstep(progress, 0.08, 0.65);
      shell?.style.setProperty("--intro-opacity", String(1 - introExit));
      shell?.style.setProperty("--intro-shift", `${introExit * -36}px`);
      const nextActive = Math.max(0, Math.min(homeSlides.length, Math.round(progress)));
      if (nextActive !== active) {
        active = nextActive;
        onActiveChange(active);
        syncVideoPlayback();
      }
      scheduleRender();
    };
    const onScroll = () => readScroll();
    const cleanupScroll = () => {
      scroller.removeEventListener("scroll", onScroll);
      shell?.style.removeProperty("--intro-opacity");
      shell?.style.removeProperty("--intro-shift");
    };

    measureAnchors();
    readScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return cleanupScroll;
    }

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x08090b, 1.25));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(-3, 4, 7);
    scene.add(keyLight);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 6;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "three-canvas";
    host.appendChild(renderer.domElement);

    const cards: Card[] = [];
    let cardWidth = 1;
    let centerX = 0;
    let centerY = 0;
    let mobile = mobileQuery.matches;
    let reducedMotion = motionQuery.matches;
    let frame = 0;
    let disposed = false;
    let cypherVideo: HTMLVideoElement | undefined;

    const render = () => {
      const targetProgress = reducedMotion ? Math.round(progress) : progress;
      visualProgress = reducedMotion ? targetProgress : THREE.MathUtils.lerp(visualProgress, targetProgress, 0.08);
      if (!reducedMotion && (Math.abs(targetProgress - visualProgress) > 0.001 || active === 1 && cypherVideo && !cypherVideo.paused)) scheduleRender();
      const projectProgress = Math.max(0, visualProgress - 1);
      const deckOpacity = reducedMotion ? Number(visualProgress >= 1) : THREE.MathUtils.smoothstep(visualProgress, 0.08, 0.65);
      const currentIndex = Math.min(projects.length - 1, Math.floor(projectProgress));
      const phase = THREE.MathUtils.clamp(projectProgress - currentIndex, 0, 1);
      const eased = THREE.MathUtils.smootherstep(phase, 0, 1);
      const cardHeight = cardWidth * 0.625;

      cards.forEach((card, index) => {
        const outgoing = index === currentIndex;
        const incoming = index === currentIndex + 1;
        if (!outgoing && !incoming) {
          card.group.visible = false;
          return;
        }

        const depth = mobile ? 0.24 : 0.48;
        const maxTilt = THREE.MathUtils.degToRad(mobile ? 1.5 : 3);
        const opacity = (outgoing
          ? 1 - THREE.MathUtils.smootherstep(phase, 0.88, 1)
          : THREE.MathUtils.smootherstep(phase, 0.02, 0.14)) * deckOpacity;
        const brightness = outgoing
          ? THREE.MathUtils.lerp(1, 0.5, eased)
          : THREE.MathUtils.lerp(0.76, 1, eased);
        const layer = incoming ? 2 : 1;

        card.group.visible = opacity > 0.01;
        card.group.position.set(
          centerX,
          outgoing ? centerY + cardHeight * 0.1 * eased : THREE.MathUtils.lerp(centerY - cardHeight * 1.08, centerY, eased),
          outgoing ? -depth * eased : THREE.MathUtils.lerp(mobile ? 0.06 : 0.12, 0, eased),
        );
        card.group.scale.setScalar(cardWidth * (outgoing ? THREE.MathUtils.lerp(1, 0.955, eased) : THREE.MathUtils.lerp(0.97, 1, eased)));
        card.group.rotation.set(outgoing ? -maxTilt * 0.74 * eased : maxTilt * (1 - eased), 0, 0);
        card.border.renderOrder = layer * 2;
        card.image.renderOrder = layer * 2 + 1;
        card.image.material.color.setScalar(brightness);
        card.image.material.opacity = opacity;
        card.border.material.opacity = opacity * 0.82;
      });
      renderer.render(scene, camera);
    };
    scheduleRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        render();
      });
    };
    const resize = () => {
      mobile = mobileQuery.matches;
      reducedMotion = motionQuery.matches;
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.fov = mobile ? 48 : 42;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      const worldPerPixel = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z) / height;
      const rail = mobile ? 0 : Math.min(304, Math.max(268, width * 0.185));
      const stageGap = Math.min(64, Math.max(40, width * 0.04));
      const cardWidthPixels = mobile
        ? Math.min(width - 32, height < 600 ? height * 0.64 : width)
        : Math.min(1240, width - rail - stageGap * 2, height * 1.18);
      const cardHeightPixels = cardWidthPixels * 0.625;
      const cardLeftPixels = mobile ? (width - cardWidthPixels) / 2 : rail + (width - rail - cardWidthPixels) / 2;
      const cardTopPixels = mobile ? (height < 600 ? 72 : 124) : (height - cardHeightPixels) / 2;
      cardWidth = cardWidthPixels * worldPerPixel;
      centerX = ((mobile ? width / 2 : rail + (width - rail) * 0.5) - width / 2) * worldPerPixel;
      centerY = mobile
        ? (height / 2 - cardTopPixels - cardHeightPixels / 2) * worldPerPixel
        : 0;
      renderer.setScissorTest(true);
      renderer.setScissor(
        Math.max(0, Math.floor(cardLeftPixels - 2)),
        Math.max(0, Math.floor(height - cardTopPixels - cardHeightPixels - 2)),
        Math.min(width, Math.ceil(cardWidthPixels + 4)),
        Math.min(height, Math.ceil(cardHeightPixels + 4)),
      );
      measureAnchors();
      readScroll();
      syncVideoPlayback();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resizeObserver.observe(scroller);
    mobileQuery.addEventListener("change", resize);
    motionQuery.addEventListener("change", resize);
    resize();

    const loader = new THREE.TextureLoader();
    Promise.allSettled(projects.map((project) => loader.loadAsync(project.visual))).then((results) => {
      const textures = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
      if (disposed || textures.length !== projects.length) {
        textures.forEach((texture) => texture.dispose());
        return;
      }
      textures.forEach((texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        const card = createCard(texture);
        cards.push(card);
        scene.add(card.group);
      });
      cypherVideo = document.createElement("video");
      cypherVideo.src = withBasePath("/projects/cypherlab/market-demo.mp4");
      cypherVideo.muted = true;
      cypherVideo.defaultMuted = true;
      cypherVideo.loop = true;
      cypherVideo.playsInline = true;
      cypherVideo.preload = "auto";
      syncVideoPlayback = () => {
        if (!cypherVideo) return;
        if (active === 1 && !reducedMotion) void cypherVideo.play().then(scheduleRender).catch(() => {});
        else cypherVideo.pause();
      };
      cypherVideo.addEventListener("canplay", () => {
        if (disposed || !cypherVideo) return;
        const texture = new THREE.VideoTexture(cypherVideo);
        texture.colorSpace = THREE.SRGBColorSpace;
        cards[0].image.material.map?.dispose();
        cards[0].image.material.map = texture;
        cards[0].image.material.needsUpdate = true;
        syncVideoPlayback();
        scheduleRender();
      }, { once: true });
      cypherVideo.load();
      onReady();
      scheduleRender();
    });

    return () => {
      disposed = true;
      cleanupScroll();
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mobileQuery.removeEventListener("change", resize);
      motionQuery.removeEventListener("change", resize);
      cards.forEach((card) => {
        card.image.geometry.dispose();
        card.image.material.map?.dispose();
        card.image.material.dispose();
        card.border.geometry.dispose();
        card.border.material.dispose();
      });
      cypherVideo?.pause();
      cypherVideo?.removeAttribute("src");
      cypherVideo?.load();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onActiveChange, onReady, scrollerRef]);

  return <div ref={hostRef} className="three-deck" aria-hidden="true" />;
}
