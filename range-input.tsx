/* global requestAnimationFrame, cancelAnimationFrame */
import React, { useEffect, useState } from 'react';
// import { styled, withStyles } from '@mui/styles';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

// const PositionContainer = styled('div')({
//   position: 'absolute',
//   zIndex: 1,
//   bottom: '40px',
//   width: '100%',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center'
// });

// const SliderInput = withStyles({
//   root: {
//     marginLeft: 12,
//     width: '40%'
//   },
//   valueLabel: {
//     '& span': {
//       background: 'none',
//       color: '#000'
//     }
//   }
// })(Slider);

export default function RangeInput({
  min,
  max,
  value,
  animationSpeed,
  onChange,
  formatLabel
}: {
  min: number;
  max: number;
  value: [start: number, end: number];
  animationSpeed: number;
  onChange: (value: [start: number, end: number]) => void;
  formatLabel: (value: number) => string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [animation] = useState<{
    id?: number;
  }>({});

  // @ts-ignore
  useEffect(() => {
    return () => animation.id && cancelAnimationFrame(animation.id);
  }, [animation]);

  if (isPlaying && !animation.id) {
    const span = value[1] - value[0];
    let nextValueMin = value[0] + animationSpeed;
    if (nextValueMin + span >= max) {
      nextValueMin = min;
    }
    animation.id = requestAnimationFrame(() => {
      animation.id = 0;
      onChange([nextValueMin, nextValueMin + span]);
    });
  }

  const isButtonEnabled = value[0] > min || value[1] < max;

  return (
    <div style={{
      position: 'absolute',
      zIndex: 1,
      bottom: '40px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Button
        color="primary"
        disabled={!isButtonEnabled}
        onClick={() => setIsPlaying(!isPlaying)}
        title={isPlaying ? 'Stop' : 'Animate'}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <Slider
        min={min}
        max={max}
        value={value}
        // @ts-ignore
        onChange={(_, newValue: [number, number]) => onChange(newValue)}
        valueLabelDisplay="auto"
        valueLabelFormat={formatLabel}
      />
    </div>
  );
}
