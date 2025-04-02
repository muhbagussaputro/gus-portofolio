declare module 'react-lottie' {
  import { CSSProperties } from 'react';

  interface LottieProps {
    options: {
      animationData: any;
      loop?: boolean;
      autoplay?: boolean;
      rendererSettings?: {
        preserveAspectRatio?: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    height?: number | string;
    width?: number | string;
    isStopped?: boolean;
    isPaused?: boolean;
    speed?: number;
    segments?: number[];
    direction?: number;
    ariaRole?: string;
    ariaLabel?: string;
    isClickToPauseDisabled?: boolean;
    title?: string;
    style?: CSSProperties;
    eventListeners?: Array<{
      eventName: string;
      callback: () => void;
    }>;
  }

  const Lottie: React.FC<LottieProps>;
  export default Lottie;
} 