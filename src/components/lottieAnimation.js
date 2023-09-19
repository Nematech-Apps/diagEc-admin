import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LottieAnimation = ({ animationData }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg', // You can choose 'svg', 'canvas', or 'html' depending on your preference
      loop: true,
      autoplay: true,
      animationData: animationData, // Your Lottie animation data
    });

    return () => {
      // Cleanup animation when the component unmounts
      anim.destroy();
    };
  }, [animationData]);

  return <div ref={containerRef} />;
};

export default LottieAnimation;
