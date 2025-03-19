import React, {
	useEffect,
	useState,
	Dispatch,
	SetStateAction,
	useRef,
	useCallback,
	memo,
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
export type RangeValues = [start: number, end: number];
type RangeSliderProps = {
	min: number;
	max: number;
	values: RangeValues;
	onChange: Dispatch<SetStateAction<RangeValues>>;
	formatLabel: (values: number) => string;
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
function RangeSlider({
	min,
	max,
	values,
	onChange,
	formatLabel,
}: RangeSliderProps) {
	const animationIdRef = useRef<number>();
	const [isPlaying, setIsPlaying] = useState(false);
	const isButtonEnabled =
		values[0] < values[1] && (values[0] > min || values[1] < max);

	const iconProps = {
		style: { color: getIconColor(isButtonEnabled), fontSize: '30px' },
	};

	/**
	 * Handle slider values change
	 */
	const handleSliderChange = useCallback(
		(newValues: number[]) => onChange(newValues as RangeValues),
		[],
	);

	/**
	 * Toggle animation play/pause
	 */
	const toggleAnimation = useCallback(() => {
		setIsPlaying((prevIsPlaying) => !prevIsPlaying);
	}, []);

	/**
	 * Handle animation frame updates
	 */
	const updateAnimation = useCallback(() => {
		const span = values[1] - values[0];
		let nextValueMin = values[0] + ANIMATION_SPEED;

		if (nextValueMin + span >= max) {
			nextValueMin = min;
		}

		onChange([nextValueMin, nextValueMin + span]);

		// Schedule the next animation frame
		if (isPlaying) {
			animationIdRef.current = requestAnimationFrame(updateAnimation);
		}
	}, [values, min, max, isPlaying, onChange]);

	// Animation effect triggered when isPlaying changes
	useEffect(() => {
		if (isPlaying) {
			animationIdRef.current = requestAnimationFrame(updateAnimation);
		}

		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
				animationIdRef.current = undefined;
			}
		};
	}, [isPlaying, updateAnimation]);

	return (
		<div className={styles.slider}>
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
					value={values}
					range={{ draggableTrack: true }}
					tooltip={{ open: false }}
					onChange={handleSliderChange}
					marks={{
						[values[0]]: formatLabel(values[0]),
						[values[1]]: formatLabel(values[1]),
					}}
				/>
			</div>
		</div>
	);
}

export default memo(RangeSlider);
