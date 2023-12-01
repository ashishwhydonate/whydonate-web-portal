import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';

const translatedRangeLabel = (
	page: number,
	pageSize: number,
	length: number
) => {
	let ofLabel = $localize`:@@paginator_ofLabel:of`;
	if (length == 0 || pageSize == 0) {
		return `0 ${ofLabel} ${length}`;
	}

	length = Math.max(length, 0);

	const startIndex = page * pageSize;

	// If the start index exceeds the list length, do not try and fix the end index to the end.
	const endIndex =
		startIndex < length
			? Math.min(startIndex + pageSize, length)
			: startIndex + pageSize;

	return `${startIndex + 1} - ${endIndex} ${ofLabel} ${length}`;
};

export function MyPaginatorIntl() {
	const paginatorIntl = new MatPaginatorIntl();
	paginatorIntl.getRangeLabel = translatedRangeLabel;

	return paginatorIntl;
}
