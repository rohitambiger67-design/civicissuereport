import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
  onCapture: (imageData: string, location: GeolocationPosition | null) => void;
  capturedImage: string | null;
  onRetake: () => void;
}

const CameraCapture = ({ onCapture, capturedImage, onRetake }: CameraCaptureProps) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Get location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setLocationLoading(false);
        },
        (error) => {
          console.error("Location error:", error);
          setLocationError("Unable to detect location");
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocationError("Geolocation not supported");
      setLocationLoading(false);
    }
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setIsVideoReady(false);
  };

  const startCamera = async () => {
    // Don't start if already streaming or if we have a captured image
    if (streamRef.current || capturedImage) return;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment", 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        },
      });
      
      streamRef.current = mediaStream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to be ready before allowing capture
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setIsVideoReady(true);
          }).catch(console.error);
        };
      }
      
      setIsStreaming(true);
      setCameraError(null);
    } catch (error) {
      console.error("Camera error:", error);
      setCameraError(t("cameraError"));
    }
  };

  // Start camera when component mounts and no captured image
  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [capturedImage]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !isVideoReady) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Ensure video has valid dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video dimensions not ready");
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      
      // Verify image data is valid (not blank)
      if (imageData && imageData.length > 100) {
        stopCamera();
        onCapture(imageData, location);
      } else {
        console.error("Captured image data is invalid");
      }
    }
  };

  const handleRetake = () => {
    onRetake();
    // Small delay before restarting camera to ensure clean state
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  if (capturedImage) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-secondary">
        <img
          src={capturedImage}
          alt="Captured issue"
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          {location && (
            <div className="flex items-center gap-2 rounded-full bg-background/90 px-3 py-2 text-sm backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-civic-saffron" />
              <span className="text-foreground">
                {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
              </span>
            </div>
          )}
          <Button
            variant="secondary"
            onClick={handleRetake}
            className="gap-2 rounded-full shadow-lg"
          >
            <RefreshCw className="h-4 w-4" />
            {t("retakePhoto")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-secondary">
      {cameraError ? (
        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <X className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-muted-foreground">{cameraError}</p>
          <Button onClick={startCamera} variant="civic">
            {t("allowCamera")}
          </Button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-[4/3] object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Overlay with controls */}
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {/* Location indicator */}
            <div className="flex justify-end">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-sm backdrop-blur-sm",
                  location ? "bg-success/90 text-success-foreground" : "bg-background/80"
                )}
              >
                <MapPin className={cn("h-4 w-4", locationLoading && "animate-pulse")} />
                <span>
                  {locationLoading
                    ? t("detectingLocation")
                    : locationError
                    ? locationError
                    : `${location?.coords.latitude.toFixed(4)}, ${location?.coords.longitude.toFixed(4)}`}
                </span>
              </div>
            </div>

            {/* Capture button */}
            <div className="flex justify-center">
              <Button
                onClick={handleCapture}
                size="xl"
                variant="civic-accent"
                className="gap-2 rounded-full shadow-xl"
                disabled={!isVideoReady}
              >
                <Camera className="h-5 w-5" />
                {isVideoReady ? t("capturePhoto") : "Loading..."}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;
