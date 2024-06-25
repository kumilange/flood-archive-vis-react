import { AREAS } from '../../constants';

const AMERICA_GROUP_OPTIONS = Object.keys(AREAS)
	.filter((key) => key.includes('america'))
	.map((area) => ({ value: area, label: AREAS[area].label }));
const ASIA_GROUP_OPTIONS = Object.keys(AREAS)
	.filter((key) => key.includes('asia'))
	.map((area) => ({ value: area, label: AREAS[area].label }));
export const AREA_SELECT_OPTIONS = generateOptions();

/**
 * Generates a structured list of options for a select dropdown, grouping certain areas under "America" and "Asia" while listing other areas individually.
 * @returns An array of objects representing grouped and individual area options for a select dropdown.
 */
function generateOptions() {
	let hasAmerica = false;
	let hasAsia = false;
	const options: {
		label: string;
		title?: string;
		options?:
			| { value: string; label: string }[]
			| { value: string; label: string }[];
		value?: string;
	}[] = [];

	Object.keys(AREAS).forEach((key) => {
		if (key.includes('america')) {
			if (hasAmerica) return;

			hasAmerica = true;
			options.push({
				label: 'America',
				title: 'America',
				options: AMERICA_GROUP_OPTIONS,
			});

			return;
		} else if (key.includes('asia')) {
			if (hasAsia) return;

			hasAsia = true;
			options.push({
				label: 'Asia',
				title: 'Asia',
				options: ASIA_GROUP_OPTIONS,
			});

			return;
		} else {
			options.push({ value: key, label: AREAS[key].label });
		}
	});

	return options;
}
