import React, { useEffect, useState } from 'react';
import { Slider } from 'antd';
import Button from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import './RangeSlider.css';
export default function RangeSlider({
	min,
	max,
	value,
	animationSpeed,
	onChange,
	formatLabel,
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
		<div
			style={{
				position: 'absolute',
				zIndex: 1,
				bottom: '40px',
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Button
				color="primary"
				disabled={!isButtonEnabled}
				onClick={() => setIsPlaying(!isPlaying)}
				title={isPlaying ? 'Stop' : 'Animate'}
			>
				{isPlaying ? (
					<PauseIcon fontSize="large" />
				) : (
					<PlayIcon fontSize="large" />
				)}
			</Button>
			<div style={{ width: '80%', marginLeft: '10px' }}>
				<Slider
					min={min}
					max={max}
					value={value}
					range={{ draggableTrack: true }}
					tooltip={{ open: false }}
					onChange={(newValue: [number, number]) => onChange(newValue)}
					marks={{
						[value[0]]: formatLabel(value[0]),
						[value[1]]: formatLabel(value[1]),
					}}
				/>
			</div>
		</div>
	);
}
