import React, {
	useEffect,
	useState,
	Dispatch,
	SetStateAction,
	useRef,
	useCallback,
} from 'react';
import { Slider, Button } from 'antd';
import CaretRightOutlined from '@ant-design/icons/CaretRightOutlined';
import PauseOutlined from '@ant-design/icons/PauseOutlined';
import './ant-slider.scss';
import styles from './RangeSlider.module.scss';

// Constants
const MS_PER_DAY = 8.64e7;
const ANIMATION_SPEED = MS_PER_DAY * 10;

// Types
type RangeValue = [start: number, end: number];
type RangeSliderProps = {
	min: number;
	max: number;
	value: RangeValue;
	onChange: Dispatch<SetStateAction<RangeValue | undefined>>;
	formatLabel: (value: number) => string;
};

/**
 * Get the appropriate icon color based on button state
 */
const getIconColor = (isEnabled: boolean): string =>
	isEnabled ? '#08519c' : 'rgba(0, 0, 0, 0.26)';

/**
 * RangeSlider component that allows users to select a time range
 * and animate through time
 */
export default function RangeSlider({
	min,
	max,
	value,
	onChange,
	formatLabel,
}: RangeSliderProps) {
	const animationIdRef = useRef<number>();
	const [isPlaying, setIsPlaying] = useState(false);
	const isButtonEnabled = value[0] > min || value[1] < max;

	const iconProps = {
		style: { color: getIconColor(isButtonEnabled), fontSize: '30px' },
	};

	/**
	 * Handle animation frame updates
	 */
	const updateAnimation = useCallback(() => {
		const span = value[1] - value[0];
		let nextValueMin = value[0] + ANIMATION_SPEED;

		if (nextValueMin + span >= max) {
			nextValueMin = min;
		}

		onChange([nextValueMin, nextValueMin + span]);
	}, [value, min, max, onChange]);

	/**
	 * Toggle animation play/pause
	 */
	const toggleAnimation = useCallback(() => {
		setIsPlaying((prevIsPlaying) => !prevIsPlaying);
	}, []);

	/**
	 * Handle slider value change
	 */
	const handleSliderChange = useCallback(
		(newValue: number[]) => onChange(newValue as RangeValue),
		[onChange],
	);

	// Animation effect
	useEffect(() => {
		if (isPlaying) {
			animationIdRef.current = requestAnimationFrame(() => {
				animationIdRef.current = 0;
				updateAnimation();
			});
		}

		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}
		};
	}, [isPlaying, updateAnimation]);

	return (
		<>
			<Button
				color="primary"
				shape="circle"
				disabled={!isButtonEnabled}
				onClick={toggleAnimation}
				title={isPlaying ? 'Stop' : 'Animate'}
				icon={
					isPlaying ? (
						<PauseOutlined {...iconProps} />
					) : (
						<CaretRightOutlined {...iconProps} />
					)
				}
			/>
			<div className={styles.wrapper}>
				<Slider
					min={min}
					max={max}
					value={value}
					range={{ draggableTrack: true }}
					tooltip={{ open: false }}
					onChange={handleSliderChange}
					marks={{
						[value[0]]: formatLabel(value[0]),
						[value[1]]: formatLabel(value[1]),
					}}
				/>
			</div>
		</>
	);
}
