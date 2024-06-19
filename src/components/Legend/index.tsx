import React from 'react';
import styles from './Legend.module.scss';
export default function Legend() {
	return (
		<div className={styles.legend}>
			<span className={styles.title}>Death Toll</span>
			<div className={styles.item}>
				<span className={`${styles.color0} ${styles.color}`}></span>
				<span className={styles.label}>0</span>
			</div>
			<div className={styles.item}>
				<span className={`${styles.color1} ${styles.color}`}></span>
				<span className={styles.label}>1 - 10</span>
			</div>
			<div className={styles.item}>
				<span className={`${styles.color2} ${styles.color}`}></span>
				<span className={styles.label}>11 - 50</span>
			</div>
			<div className={styles.item}>
				<span className={`${styles.color3} ${styles.color}`}></span>
				<span className={styles.label}>51 - 100</span>
			</div>
			<div className={styles.item}>
				<span className={`${styles.color4} ${styles.color}`}></span>
				<span className={styles.label}>101 - 1000</span>
			</div>
			<div className={styles.item}>
				<span className={`${styles.color5} ${styles.color}`}></span>
				<span className={styles.label}>1001+</span>
			</div>
		</div>
	);
}
