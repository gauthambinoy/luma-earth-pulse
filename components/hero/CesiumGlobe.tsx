"use client";

import { useRef, useEffect, useState, useCallback } from "react";

/* ─── CesiumGlobe ───
   Google Earth-style 3D globe with real satellite imagery.
   Uses CesiumJS with Cesium Ion for terrain + imagery tiles.
   Supports zoom from outer space → street level. */

// Load Cesium CSS from CDN
if (typeof window !== "undefined") {
  const id = "cesium-widgets-css";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://cesium.com/downloads/cesiumjs/releases/1.140/Build/Cesium/Widgets/widgets.css";
    document.head.appendChild(link);
  }
}

interface CesiumGlobeProps {
  onReady?: () => void;
  flyToLocation?: { lat: number; lng: number; altitude?: number } | null;
  showOverlays?: boolean;
}

export default function CesiumGlobe({ onReady, flyToLocation, showOverlays = true }: CesiumGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const overlayCleanupRef = useRef<{ remove: () => void } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initCesium = useCallback(async () => {
    if (!containerRef.current || viewerRef.current) return;

    try {
      const Cesium = await import("cesium");

      // Configure Cesium Ion token
      const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
      if (token) {
        Cesium.Ion.defaultAccessToken = token;
      }

      // Create viewer with premium settings
      const viewer = new Cesium.Viewer(containerRef.current, {
        // Imagery
        baseLayerPicker: false,
        // @ts-expect-error imageryProvider: false disables default layer in Cesium 1.104+
        imageryProvider: false,

        // Terrain
        terrain: token
          ? Cesium.Terrain.fromWorldTerrain({
              requestWaterMask: true,
              requestVertexNormals: true,
            })
          : undefined,

        // Disable default UI chrome for clean look
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        navigationHelpButton: false,
        creditContainer: document.createElement("div"),

        // Rendering
        orderIndependentTranslucency: true,
        contextOptions: {
          webgl: {
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          },
        },
      });

      // Add Bing Maps or Cesium Ion default imagery
      if (token) {
        try {
          const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(2);
          viewer.imageryLayers.addImageryProvider(imageryProvider);
        } catch {
          // Fallback to OpenStreetMap if Ion fails
          viewer.imageryLayers.addImageryProvider(
            new Cesium.OpenStreetMapImageryProvider({
              url: "https://tile.openstreetmap.org/",
            })
          );
        }
      } else {
        // No token — use OSM as fallback
        viewer.imageryLayers.addImageryProvider(
          new Cesium.OpenStreetMapImageryProvider({
            url: "https://tile.openstreetmap.org/",
          })
        );
      }

      // Scene atmosphere & space styling
      const scene = viewer.scene;
      if (scene.skyAtmosphere) {
        scene.skyAtmosphere.hueShift = -0.05;
        scene.skyAtmosphere.saturationShift = 0.1;
        scene.skyAtmosphere.brightnessShift = -0.1;
      }
      scene.fog.enabled = true;
      scene.globe.enableLighting = true;
      scene.globe.atmosphereLightIntensity = 8.0;
      scene.globe.showGroundAtmosphere = true;

      // Stars and sun
      if (scene.skyBox) (scene.skyBox as any).show = true;
      if (scene.sun) scene.sun.show = true;
      if (scene.moon) scene.moon.show = true;

      // High-quality rendering
      scene.globe.maximumScreenSpaceError = 1.5;
      scene.highDynamicRange = true;
      scene.postProcessStages.fxaa.enabled = true;

      // Set initial camera: full Earth view from space
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(20, 20, 18000000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0,
        },
      });

      // Smooth auto-rotation
      let lastTime = Date.now();
      const rotationSpeed = 0.3; // degrees per second
      const removeRotation = viewer.clock.onTick.addEventListener(() => {
        const now = Date.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        if (!scene.screenSpaceCameraController.enableInputs) return;

        const cameraPosition = viewer.camera.positionCartographic;
        if (cameraPosition) {
          const newLon =
            Cesium.Math.toDegrees(cameraPosition.longitude) +
            rotationSpeed * delta;
          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
              newLon,
              Cesium.Math.toDegrees(cameraPosition.latitude),
              cameraPosition.height
            ),
          });
        }
      });

      // Pause rotation on user interaction
      let userInteracting = false;
      let interactionTimeout: NodeJS.Timeout;
      const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

      handler.setInputAction(() => {
        userInteracting = true;
        scene.screenSpaceCameraController.enableInputs = true;
        clearTimeout(interactionTimeout);
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      handler.setInputAction(() => {
        userInteracting = false;
        interactionTimeout = setTimeout(() => {
          if (!userInteracting) {
            scene.screenSpaceCameraController.enableInputs = true;
          }
        }, 3000);
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      handler.setInputAction(() => {
        userInteracting = true;
        clearTimeout(interactionTimeout);
      }, Cesium.ScreenSpaceEventType.WHEEL);

      // Store refs for cleanup
      viewerRef.current = viewer;
      (viewerRef.current as any)._rotationHandler = removeRotation;
      (viewerRef.current as any)._eventHandler = handler;

      setLoading(false);
      onReady?.();

      // Load data overlays (earthquake pins, ISS tracker, weather markers)
      if (showOverlays) {
        try {
          const { addAllOverlays } = await import("./overlays");
          const cleanup = await addAllOverlays(viewer);
          overlayCleanupRef.current = cleanup;
        } catch (err) {
          console.warn("Failed to load globe overlays:", err);
        }
      }
    } catch (err) {
      console.error("Failed to initialize CesiumJS:", err);
      setError("Failed to load 3D globe");
      setLoading(false);
    }
  }, [onReady]);

  // Initialize
  useEffect(() => {
    initCesium();

    return () => {
      if (overlayCleanupRef.current) {
        overlayCleanupRef.current.remove();
        overlayCleanupRef.current = null;
      }
      if (viewerRef.current) {
        try {
          const viewer = viewerRef.current;
          if (viewer._rotationHandler) viewer._rotationHandler();
          if (viewer._eventHandler) viewer._eventHandler.destroy();
          if (!viewer.isDestroyed()) viewer.destroy();
        } catch {}
        viewerRef.current = null;
      }
    };
  }, [initCesium]);

  // Cinematic fly-to when location prop changes
  useEffect(() => {
    if (!flyToLocation || !viewerRef.current) return;

    const Cesium = require("cesium");
    const viewer = viewerRef.current;
    const altitude = flyToLocation.altitude || 2000000;

    // Two-phase cinematic: pull back → sweep in
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        flyToLocation.lng,
        flyToLocation.lat,
        altitude
      ),
      orientation: {
        heading: Cesium.Math.toRadians(20),
        pitch: Cesium.Math.toRadians(-35),
        roll: 0,
      },
      duration: 3,
      easingFunction: Cesium.EasingFunction.QUINTIC_IN_OUT,
    });
  }, [flyToLocation]);

  return (
    <div className="cesium-globe-wrapper">
      <div
        ref={containerRef}
        className="cesium-globe-container"
        role="img"
        aria-label="Interactive 3D satellite globe — drag to rotate, scroll to zoom from space to street level"
      />

      {/* Loading overlay */}
      {loading && (
        <div className="globe-loading-overlay">
          <div className="globe-loader">
            <div className="globe-loader-ring" />
          </div>
          <span className="globe-loading-text">Loading satellite imagery...</span>
        </div>
      )}

      {/* Error fallback */}
      {error && (
        <div className="globe-error-overlay">
          <span>🌍</span>
          <p>{error}</p>
        </div>
      )}

      {/* Interaction hint */}
      {!loading && !error && <GlobeHint />}
    </div>
  );
}

/* ─── Hint that fades out ─── */
function GlobeHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="globe-touch-hint">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Drag to explore · Scroll to zoom to street level</span>
    </div>
  );
}
