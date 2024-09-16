import { useEffect, useRef } from "react";
import { SkinViewer, type SkinViewerOptions } from "skinview3d";

const ReactSkinview3d = ({
  className,
  width,
  height,
  skinUrl,
  capeUrl,
  onReady,
  options,
}: {
  className?: string;
  width: number | string;
  height: number | string;
  skinUrl: string;
  capeUrl?: string;
  onReady?: ({
    viewer,
    canvasRef,
  }: {
    viewer: SkinViewer;
    canvasRef: HTMLCanvasElement;
  }) => void;
  options?: SkinViewerOptions;
}): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const skinviewRef = useRef<SkinViewer | null>(null);

  useEffect(() => {
    const viewer = new SkinViewer({
      canvas: canvasRef.current!,
      width: Number(width),
      height: Number(height),
      ...options,
    });

    // handle cape/skin load initially
    skinUrl && viewer.loadSkin(skinUrl);
    capeUrl && viewer.loadCape(capeUrl);

    skinviewRef.current = viewer;

    // call onReady with the viewer instance
    if (onReady && canvasRef.current) {
      onReady({ viewer: skinviewRef.current, canvasRef: canvasRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // skin url changes
  useEffect(() => {
    if (skinviewRef.current) {
      skinUrl
        ? skinviewRef.current.loadSkin(skinUrl)
        : skinviewRef.current.resetSkin();
    }
  }, [skinUrl]);

  // cape url changes
  useEffect(() => {
    if (skinviewRef.current) {
      capeUrl
        ? skinviewRef.current.loadCape(capeUrl)
        : skinviewRef.current.resetCape();
    }
  }, [capeUrl]);

  // size changes
  useEffect(() => {
    if (skinviewRef.current) {
      skinviewRef.current.setSize(Number(width), Number(height));
    }
  }, [width, height]);

  return <canvas className={className} ref={canvasRef} />;
};

export default ReactSkinview3d;
