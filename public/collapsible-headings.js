(function () {
	function openSectionForHash() {
		var hash = window.location.hash;
		if (!hash) return;
		var id = hash.slice(1);
		var target = document.getElementById(id);
		if (!target) return;
		var details = target.closest('details.ria-section');
		if (details) details.open = true;
	}

	function init() {
		var content = document.querySelector('.sl-markdown-content');
		if (!content) return;
		if (content.dataset.riaSectionsInit) return;
		content.dataset.riaSectionsInit = '1';

		// Starlight wraps each heading + anchor link in .sl-heading-wrapper.level-h2
		var wrappers = Array.from(content.querySelectorAll('.sl-heading-wrapper.level-h2'));
		if (!wrappers.length) return;

		wrappers.forEach(function (wrapper) {
			var details = document.createElement('details');
			details.open = true;
			details.className = 'ria-section';

			var summary = document.createElement('summary');
			summary.className = 'ria-section-heading';
			// Keep the wrapper (h2 + anchor link) inside the summary so the id
			// and heading styles are preserved unchanged.
			summary.appendChild(wrapper);
			details.appendChild(summary);

			// Collect following siblings until the next level-h2 wrapper
			var body = document.createElement('div');
			body.className = 'ria-section-body';
			var next = wrapper.nextSibling;
			while (next) {
				var following = next.nextSibling;
				if (
					next.nodeType === 1 &&
					next.classList &&
					next.classList.contains('sl-heading-wrapper') &&
					next.classList.contains('level-h2')
				) {
					break;
				}
				body.appendChild(next);
				next = following;
			}
			details.appendChild(body);

			wrapper.parentNode.replaceChild(details, wrapper);
		});

		openSectionForHash();
	}

	window.addEventListener('hashchange', openSectionForHash);

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	// Re-run on Astro view transitions
	document.addEventListener('astro:page-load', function () {
		var content = document.querySelector('.sl-markdown-content');
		if (content) delete content.dataset.riaSectionsInit;
		init();
	});
})();
