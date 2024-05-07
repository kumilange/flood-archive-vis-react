import React, { useEffect, useState } from 'react';
import { Slider } from 'antd';
import Button from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import './ant-slider.css';

const MS_PER_DAY = 8.64e7;
const ANIMATION_SPEED = MS_PER_DAY * 10;
const getIconColor = (isEnabled: boolean) => isEnabled ? '#08519c' : "rgba(0, 0, 0, 0.26)";

export default function RangeSlider({
	min,
	max,
	value,
	onChange,
	formatLabel,
}: {
	min: number;
	max: number;
	value: [start: number, end: number];
	onChange: (value: [start: number, end: number]) => void;
	formatLabel: (value: number) => string;
}) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [animation] = useState<{
		id?: number;
	}>({});
	const isButtonEnabled = value[0] > min || value[1] < max;
	const iconProps = {
		fontSize: 'large',
		style: { color: getIconColor(isButtonEnabled) },
	};

	useEffect(() => {
		return () => animation.id && cancelAnimationFrame(animation.id);
	}, [animation]);

	if (isPlaying && !animation.id) {
		const span = value[1] - value[0];
		let nextValueMin = value[0] + ANIMATION_SPEED;
		if (nextValueMin + span >= max) {
			nextValueMin = min;
		}
		animation.id = requestAnimationFrame(() => {
			animation.id = 0;
			onChange([nextValueMin, nextValueMin + span]);
		});
	}


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
					<PauseIcon {...iconProps} />
				) : (
					<PlayIcon {...iconProps} />
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
