// src/lib/utils/loadIndexData.js
export async function loadIndexData(prefix) {
	const baseUrl =
		'https://raw.githubusercontent.com/RobinKohrs/redondo_data/refs/heads/main/static/geodata/communes_single';
	const url = `${baseUrl}/${prefix}/index.csv`;

	try {
		const response = await fetch(url);
		if (response.ok) {
			const csvText = await response.text();
			const rows = csvText.split('\n').slice(1); // Skip header row
			return rows.map((row) => {
				const [name_clean, name_real] = row.split(',');
				return { name_clean, name_real };
			});
		}
	} catch (error) {
		console.error(`Failed to fetch ${url}:`, error);
	}

	return [];
}
