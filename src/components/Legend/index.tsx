import styles from './Legend.module.scss';

const legendItems = [
	{ label: '0', colorClass: styles.color0 },
	{ label: '1 - 10', colorClass: styles.color1 },
	{ label: '11 - 50', colorClass: styles.color2 },
	{ label: '51 - 100', colorClass: styles.color3 },
	{ label: '101 - 1000', colorClass: styles.color4 },
	{ label: '1001+', colorClass: styles.color5 },
];

export default function Legend() {
	return (
		<div className={styles.legend}>
			<span className={styles.title}>Death Toll</span>
			{legendItems.map((item, index) => (
				<div key={index} className={styles.item}>
					<span className={`${item.colorClass} ${styles.color}`}></span>
					<span className={styles.label}>{item.label}</span>
				</div>
			))}
		</div>
	);
}
