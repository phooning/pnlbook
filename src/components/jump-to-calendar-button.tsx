import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "#/components/ui/button.tsx";

const JUMP_BUTTON_SCROLL_THRESHOLD = 520;

export function JumpToCalendarButton() {
	const [isVisible, setIsVisible] = useState(false);
	const isVisibleRef = useRef(false);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		let animationFrameId: number | null = null;

		function setVisibleIfChanged(nextIsVisible: boolean) {
			if (isVisibleRef.current === nextIsVisible) {
				return;
			}

			isVisibleRef.current = nextIsVisible;
			setIsVisible(nextIsVisible);
		}

		function updateVisibility() {
			setVisibleIfChanged(window.scrollY > JUMP_BUTTON_SCROLL_THRESHOLD);
		}

		function handleScroll() {
			if (animationFrameId !== null) {
				return;
			}

			animationFrameId = window.requestAnimationFrame(() => {
				animationFrameId = null;
				updateVisibility();
			});
		}

		updateVisibility();
		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);

			if (animationFrameId !== null) {
				window.cancelAnimationFrame(animationFrameId);
			}
		};
	}, []);

	const jumpToTop = useCallback(() => {
		if (typeof window === "undefined") {
			return;
		}

		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

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
			aria-hidden={!isVisible}
			aria-label="Jump to top"
			tabIndex={isVisible ? 0 : -1}
			title="Jump to top"
			onClick={jumpToTop}
		>
			<ArrowUp aria-hidden="true" />
		</Button>
	);
}
