import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "#/components/ui/button.tsx";

const JUMP_BUTTON_SCROLL_THRESHOLD = 520;

export function JumpToCalendarButton() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		function updateVisibility() {
			setIsVisible(window.scrollY > JUMP_BUTTON_SCROLL_THRESHOLD);
		}

		updateVisibility();
		window.addEventListener("scroll", updateVisibility, { passive: true });

		return () => window.removeEventListener("scroll", updateVisibility);
	}, []);

	function jumpToCalendar() {
		const calendar = document.getElementById("pnl-calendar");

		if (calendar) {
			calendar.scrollIntoView({ behavior: "smooth", block: "start" });
			return;
		}

		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	return (
		<Button
			type="button"
			variant="outline"
			size="icon"
			className={`fixed right-4 bottom-4 z-40 border-neutral-700 bg-neutral-950/90 text-neutral-300 shadow-lg shadow-black/30 backdrop-blur transition-all hover:bg-neutral-900 hover:text-white sm:right-6 sm:bottom-6 ${
				isVisible
					? "translate-y-0 opacity-100"
					: "pointer-events-none translate-y-3 opacity-0"
			}`}
			aria-label="Jump to calendar"
			title="Jump to calendar"
			onClick={jumpToCalendar}
		>
			<ArrowUp />
		</Button>
	);
}
