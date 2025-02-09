import Fuse from 'fuse.js';

export function createSearchIndex(data) {
	const options = {
		keys: ['name_real', 'name_clean'], // Search by the display name
		threshold: 0.3, // Adjust for fuzzy search sensitivity
		shouldSort: true,
		includeScore: true
	};

	return new Fuse(data, options);
}
