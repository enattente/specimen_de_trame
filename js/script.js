document.addEventListener('DOMContentLoaded', () => {
	const tableau = document.getElementById('tableau-arborescence');

	if (!tableau) {
		return;
	}

	const clearHighlights = () => {
		tableau.querySelectorAll('.hover-highlight').forEach((element) => {
			element.classList.remove('hover-highlight');
		});
	};

	const getDeepestDivAtPoint = (clientX, clientY) => {
		const elements = document.elementsFromPoint(clientX, clientY);

		for (const element of elements) {
			if (element instanceof HTMLDivElement && tableau.contains(element)) {
				return element;
			}
		}

		return null;
	};

	const highlightAncestors = (element) => {
		let current = element;

		while (current && current !== tableau) {
			if (current.tagName === 'DIV') {
				current.classList.add('hover-highlight');
			}

			current = current.parentElement;
		}
	};

	tableau.addEventListener('pointermove', (event) => {
		const hoveredDiv = getDeepestDivAtPoint(event.clientX, event.clientY);

		if (!hoveredDiv || !tableau.contains(hoveredDiv)) {
			clearHighlights();
			return;
		}

		clearHighlights();
		highlightAncestors(hoveredDiv);
	});

	tableau.addEventListener('pointerleave', clearHighlights);
});

const ici = document.getElementById("ici");
const details = document.querySelectorAll(".detail");

ici.addEventListener("click", () => {
    details.forEach(detail => {
        detail.classList.toggle("visible");
    });
});