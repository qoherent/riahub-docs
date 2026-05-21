const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function getYouTubeVideoId(input?: string): string | undefined {
	if (!input) return undefined;

	const trimmed = input.trim();
	if (VIDEO_ID_PATTERN.test(trimmed)) return trimmed;

	try {
		const url = new URL(trimmed);
		const host = url.hostname.replace(/^www\./, '');

		if (host === 'youtu.be') {
			const [id] = url.pathname.split('/').filter(Boolean);
			return VIDEO_ID_PATTERN.test(id ?? '') ? id : undefined;
		}

		if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'm.youtube.com') {
			const watchId = url.searchParams.get('v');
			if (watchId && VIDEO_ID_PATTERN.test(watchId)) return watchId;

			const parts = url.pathname.split('/').filter(Boolean);
			const id = parts.find((part, index) => ['embed', 'shorts', 'live'].includes(parts[index - 1] ?? ''));
			return VIDEO_ID_PATTERN.test(id ?? '') ? id : undefined;
		}
	} catch {
		return undefined;
	}

	return undefined;
}

export function getYouTubeEmbedUrl(videoId: string, privacyEnhanced = true, start?: number, autoplay = false): string {
	const host = privacyEnhanced ? 'www.youtube-nocookie.com' : 'www.youtube.com';
	const params = new URLSearchParams({
		rel: '0',
		modestbranding: '1',
	});

	if (autoplay) params.set('autoplay', '1');
	if (typeof start === 'number' && Number.isFinite(start) && start > 0) params.set('start', String(Math.floor(start)));

	return `https://${host}/embed/${videoId}?${params.toString()}`;
}

export function getYouTubeWatchUrl(videoId: string, start?: number): string {
	const url = new URL(`https://www.youtube.com/watch`);
	url.searchParams.set('v', videoId);
	if (typeof start === 'number' && Number.isFinite(start) && start > 0) url.searchParams.set('t', `${Math.floor(start)}s`);
	return url.toString();
}
