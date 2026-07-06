import { createFileRoute } from "@tanstack/react-router";
import {
	CalendarDays,
	ChevronDown,
	Lightbulb,
	LineChart,
	TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { workspaceColorScheme } from "#/constants/color-scheme.ts";

export const Route = createFileRoute("/market-intelligence")({
	component: MarketIntelligencePage,
});

type Tone = "positive" | "warning" | "neutral" | "attention";

type DetailMetric = {
	label: string;
	value: string;
	change?: string;
	note?: string;
	tone?: Tone;
};

type IntelligenceModule = {
	id: string;
	title: string;
	status: string;
	prompt: string;
	accentClass: string;
	statusClass: string;
	snapshot?: {
		label: string;
		value: string;
		tone?: Tone;
	};
	detailTitle: string;
	metrics: Array<DetailMetric>;
	detailText: string;
};

const toneTextClass: Record<Tone, string> = {
	positive: workspaceColorScheme.accentText,
	warning: workspaceColorScheme.warningText,
	neutral: workspaceColorScheme.neutralText,
	attention: workspaceColorScheme.negativeTextSoft,
};

const intelligenceModules: Array<IntelligenceModule> = [
	{
		id: "indexes",
		title: "Indexes",
		status: "Confirming",
		prompt: "Is SPY/QQQ/IWM confirming or diverging?",
		accentClass: workspaceColorScheme.accentPipSoft,
		statusClass: `${workspaceColorScheme.accentBorderSoft} ${workspaceColorScheme.accentBg} ${workspaceColorScheme.accentTextSoft}`,
		snapshot: { label: "SPY", value: "+0.82", tone: "positive" },
		detailTitle: "Index Confirmation",
		metrics: [
			{
				label: "SPY",
				value: "598.42",
				change: "+0.82%",
				note: "Above VWAP · Confirms",
				tone: "positive",
			},
			{
				label: "QQQ",
				value: "521.08",
				change: "+1.14%",
				note: "Leading · Strong",
				tone: "positive",
			},
			{
				label: "IWM",
				value: "228.65",
				change: "+0.21%",
				note: "Lagging · Diverging",
				tone: "neutral",
			},
		],
		detailText:
			"SPY and QQQ are confirming each other. IWM is lagging, so small-cap divergence stays on the checklist before adding broad beta.",
	},
	{
		id: "semis",
		title: "Semis",
		status: "Hot",
		prompt: "Are SMH/NVDA/AVGO/MU/SNDK strong or fading?",
		accentClass: workspaceColorScheme.accentPip,
		statusClass: `${workspaceColorScheme.accentBorderSoft} ${workspaceColorScheme.accentBgStrong} ${workspaceColorScheme.accentTextSoft}`,
		snapshot: { label: "SMH", value: "+2.31", tone: "positive" },
		detailTitle: "Semi Leaders",
		metrics: [
			{ label: "SMH", value: "+2.31%", tone: "positive" },
			{ label: "NVDA", value: "+3.12%", tone: "positive" },
			{ label: "AVGO", value: "+1.87%", tone: "positive" },
			{ label: "MU", value: "+4.21%", tone: "positive" },
			{ label: "SNDK", value: "+3.65%", tone: "positive" },
		],
		detailText:
			"All semiconductor checks are green. MU and SNDK are relative-strength candidates, but entries still need VWAP support and clean volume.",
	},
	{
		id: "volatility",
		title: "Volatility",
		status: "Compressing",
		prompt: "Is VIX expanding, compressing, or misleading?",
		accentClass: "bg-yellow-400/70",
		statusClass: `${workspaceColorScheme.warningBorder} ${workspaceColorScheme.warningBg} ${workspaceColorScheme.warningText}`,
		snapshot: { label: "VIX", value: "14.32", tone: "neutral" },
		detailTitle: "Vol Structure",
		metrics: [
			{ label: "VIX Spot", value: "14.32", tone: "neutral" },
			{ label: "VIX 1M Term", value: "15.81", tone: "neutral" },
			{ label: "VVIX", value: "98.4", tone: "neutral" },
			{ label: "Skew", value: "Slight put bias", tone: "warning" },
		],
		detailText:
			"VIX is compressed but not washed out. Put skew is still present, so risk appetite is constructive without looking complacent.",
	},
	{
		id: "rates-dxy",
		title: "Rates / DXY",
		status: "Neutral",
		prompt: "Are yields or dollar pressuring growth?",
		accentClass: "bg-sky-400/70",
		statusClass: `${workspaceColorScheme.infoBorder} ${workspaceColorScheme.infoBg} ${workspaceColorScheme.infoText}`,
		snapshot: { label: "10Y", value: "4.28%", tone: "neutral" },
		detailTitle: "Rates & Dollar",
		metrics: [
			{ label: "2Y", value: "4.12%", tone: "neutral" },
			{ label: "10Y", value: "4.28%", tone: "neutral" },
			{ label: "DXY", value: "104.21", change: "-0.34%", tone: "attention" },
			{ label: "2s10s", value: "+16bp", tone: "positive" },
		],
		detailText:
			"Yields are stable and the dollar is easing. There is no direct rate-pressure signal against growth leadership right now.",
	},
	{
		id: "sector-leadership",
		title: "Sector Leadership",
		status: "Semi-led",
		prompt: "What is actually leading today?",
		accentClass: workspaceColorScheme.accentPipMuted,
		statusClass: `${workspaceColorScheme.accentBorderSoft} ${workspaceColorScheme.accentBg} ${workspaceColorScheme.accentTextSoft}`,
		detailTitle: "Sector Rank",
		metrics: [
			{ label: "1 · Technology", value: "+1.92%", tone: "positive" },
			{ label: "2 · Communication", value: "+1.14%", tone: "positive" },
			{ label: "3 · Healthcare", value: "+0.31%", tone: "neutral" },
			{ label: "8 · Utilities", value: "-0.42%", tone: "attention" },
			{ label: "9 · Real Estate", value: "-0.58%", tone: "attention" },
		],
		detailText:
			"Technology is carrying leadership and communication is confirming. Defensive sectors are not leading, which supports the risk-on read.",
	},
	{
		id: "catalysts",
		title: "Earnings / Catalysts",
		status: "3 events",
		prompt: "What names have near-term events?",
		accentClass: "bg-fuchsia-300/60",
		statusClass: "border-fuchsia-300/20 bg-fuchsia-300/10 text-fuchsia-200",
		detailTitle: "Upcoming Catalysts",
		metrics: [
			{ label: "MU", value: "Earnings AMC", change: "Today", tone: "positive" },
			{
				label: "NVDA",
				value: "Earnings Wed",
				change: "2d out",
				tone: "neutral",
			},
			{
				label: "FOMC",
				value: "Minutes Thu",
				change: "3d out",
				tone: "neutral",
			},
		],
		detailText:
			"MU carries near-term event risk. Position sizing should account for implied move, especially if the setup is already extended intraday.",
	},
	{
		id: "levels",
		title: "GEX / Key Levels",
		status: "Active",
		prompt: "Where are major magnet and rejection zones?",
		accentClass: "bg-orange-300/70",
		statusClass: "border-orange-300/20 bg-orange-300/10 text-orange-200",
		detailTitle: "SPY Key Zones",
		metrics: [
			{ label: "Resistance", value: "602.50 - 605.00", tone: "attention" },
			{ label: "VWAP", value: "596.80", tone: "positive" },
			{ label: "GEX Flip", value: "594.20", tone: "neutral" },
			{ label: "Support", value: "590.00 - 588.50", tone: "warning" },
		],
		detailText:
			"Positive GEX above 594 keeps dealer positioning supportive. The 602.50 zone may act as a magnet before it becomes resistance.",
	},
	{
		id: "breadth",
		title: "Breadth",
		status: "Narrow",
		prompt: "Is this a broad move or only mega-cap support?",
		accentClass: "bg-yellow-400/60",
		statusClass: `${workspaceColorScheme.warningBorder} ${workspaceColorScheme.warningBg} ${workspaceColorScheme.warningText}`,
		snapshot: { label: "A/D", value: "1.2:1", tone: "warning" },
		detailTitle: "Breadth Metrics",
		metrics: [
			{ label: "A/D", value: "1.2:1", tone: "warning" },
			{ label: "New Highs", value: "87", tone: "neutral" },
			{ label: "New Lows", value: "34", tone: "neutral" },
			{ label: "% Above 200D", value: "62%", tone: "neutral" },
		],
		detailText:
			"Advance-decline is weak for the index gain. Treat the tape as mega-cap supported until equal-weight and breadth improve.",
	},
];

const marketMetrics = [
	{ label: "SPY", value: "+0.82%", className: workspaceColorScheme.accentText },
	{ label: "QQQ", value: "+1.14%", className: workspaceColorScheme.accentText },
	{ label: "VIX", value: "14.32", className: workspaceColorScheme.neutralText },
	{
		label: "DXY",
		value: "-0.34%",
		className: workspaceColorScheme.negativeTextSoft,
	},
];

function MarketIntelligencePage() {
	const [openModuleId, setOpenModuleId] = useState("indexes");
	const [now, setNow] = useState<Date | null>(null);

	useEffect(() => {
		setNow(new Date());
		const intervalId = window.setInterval(() => setNow(new Date()), 1000);

		return () => window.clearInterval(intervalId);
	}, []);

	const formattedTime = useMemo(() => {
		if (!now) {
			return "--:--:--";
		}

		return new Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		}).format(now);
	}, [now]);

	const formattedDate = useMemo(() => {
		if (!now) {
			return "---";
		}

		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(now);
	}, [now]);

	return (
		<div className="relative min-h-[calc(100vh-5.25rem)] overflow-x-hidden bg-black text-white">
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_30%,transparent_100%)]" />
			<div
				className={`pointer-events-none absolute top-0 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full ${workspaceColorScheme.accentGlow} blur-3xl`}
			/>

			<main className="relative z-10 mx-auto max-w-5xl px-4 pt-8 pb-24 sm:px-6 lg:px-8">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-3">
						<div
							className={`flex h-9 w-9 items-center justify-center rounded-lg border ${workspaceColorScheme.accentBorderSoft} ${workspaceColorScheme.accentBg}`}
						>
							<TrendingUp
								className={`h-4 w-4 ${workspaceColorScheme.accentText}`}
								aria-hidden="true"
							/>
						</div>
						<div>
							<h2 className="font-semibold text-white tracking-tight">
								Market Intelligence
							</h2>
							<p className="font-mono text-[10px] text-white/35 uppercase tracking-wider">
								Daily Briefing
							</p>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<div
								className={`h-1.5 w-1.5 animate-pulse rounded-full ${workspaceColorScheme.accentPip}`}
							/>
							<span className="font-mono text-[11px] text-white/45">
								{formattedTime}
							</span>
						</div>
						<div className="hidden items-center gap-1.5 rounded-md border border-white/5 bg-[#181818] px-3 py-1.5 sm:flex">
							<CalendarDays
								className="h-3 w-3 text-white/35"
								aria-hidden="true"
							/>
							<span className="font-mono text-[11px] text-white/45">
								{formattedDate}
							</span>
						</div>
					</div>
				</header>

				<div
					className={`mt-6 h-px bg-gradient-to-r from-transparent ${workspaceColorScheme.accentDivider} to-transparent`}
				/>

				<section className="mt-6 overflow-hidden rounded-xl border border-white/[0.06] bg-[#111111]/70 backdrop-blur-sm">
					<div className="flex items-center justify-between border-white/[0.04] border-b px-5 py-3">
						<div className="flex items-center gap-2">
							<Lightbulb
								className={`h-3.5 w-3.5 ${workspaceColorScheme.accentText}`}
								aria-hidden="true"
							/>
							<span className="font-mono font-medium text-[11px] text-white/55 uppercase tracking-wider">
								Thesis Summary
							</span>
						</div>
						<span
							className={`rounded border px-2 py-0.5 font-mono font-medium text-[10px] uppercase tracking-wider ${workspaceColorScheme.accentBorderSoft} ${workspaceColorScheme.accentBg} ${workspaceColorScheme.accentTextSoft}`}
						>
							Risk-On
						</span>
					</div>
					<div className="px-5 py-4">
						<p className="text-[13px] text-white/70 leading-7">
							Today&apos;s market is{" "}
							<span
								className={`font-medium ${workspaceColorScheme.accentTextSoft}`}
							>
								risk-on but narrow
							</span>
							. Semis are hot, software is mixed, volatility is low but not
							dead, and <span className="font-medium text-white">MU/SNDK</span>{" "}
							remain leadership candidates. Best trade is long-side only above
							VWAP with clean volume.
						</p>
					</div>
					<div className="grid grid-cols-2 gap-px border-white/[0.04] border-t bg-[#181818]/60 px-5 py-3 sm:grid-cols-4">
						{marketMetrics.map((metric) => (
							<div
								key={metric.label}
								className="border-white/[0.04] py-2 pr-4 not-first:border-l not-first:pl-4"
							>
								<p className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
									{metric.label}
								</p>
								<p
									className={`mt-0.5 font-mono font-medium text-[13px] ${metric.className}`}
								>
									{metric.value}
								</p>
							</div>
						))}
					</div>
				</section>

				<section className="mt-8">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="font-mono font-medium text-[11px] text-white/35 uppercase tracking-widest">
							Intelligence Modules
						</h3>
						<span className="font-mono text-[10px] text-white/25">
							{intelligenceModules.length} categories
						</span>
					</div>

					<div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111111]/55 backdrop-blur-sm">
						{intelligenceModules.map((module) => {
							const isOpen = module.id === openModuleId;

							return (
								<article
									key={module.id}
									className="border-white/[0.04] border-b last:border-b-0"
								>
									<button
										type="button"
										className="flex w-full cursor-pointer items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
										aria-expanded={isOpen}
										onClick={() =>
											setOpenModuleId((current) =>
												current === module.id ? "" : module.id,
											)
										}
									>
										<div
											className={`h-6 w-1 shrink-0 rounded-full ${module.accentClass}`}
										/>
										<div className="min-w-0 flex-1">
											<div className="flex flex-wrap items-center gap-2.5">
												<span className="font-mono font-semibold text-[12px] text-white tracking-tight">
													{module.title}
												</span>
												<span
													className={`rounded border px-2 py-0.5 font-mono font-medium text-[10px] uppercase tracking-wider ${module.statusClass}`}
												>
													{module.status}
												</span>
											</div>
											<p className="mt-0.5 truncate text-[11.5px] text-white/40">
												{module.prompt}
											</p>
										</div>
										{module.snapshot ? (
											<div className="hidden items-center gap-2 sm:flex">
												<span className="font-mono text-[10px] text-white/25">
													{module.snapshot.label}
												</span>
												<span
													className={`font-mono text-[11px] ${
														toneTextClass[module.snapshot.tone ?? "neutral"]
													}`}
												>
													{module.snapshot.value}
												</span>
											</div>
										) : null}
										<ChevronDown
											className={`h-4 w-4 shrink-0 text-white/25 transition-transform ${
												isOpen ? "rotate-180" : ""
											}`}
											aria-hidden="true"
										/>
									</button>

									{isOpen ? <ModuleDetail module={module} /> : null}
								</article>
							);
						})}
					</div>
				</section>

				<footer className="mt-12">
					<div
						className={`mb-6 h-px bg-gradient-to-r from-transparent ${workspaceColorScheme.accentDivider} to-transparent`}
					/>
					<div className="flex flex-col gap-2 px-1 font-mono text-[10px] text-white/20 sm:flex-row sm:items-center sm:justify-between">
						<p>Market Intelligence v0.1 · Scaffolding</p>
						<p>Data delayed · For educational use only</p>
					</div>
				</footer>
			</main>
		</div>
	);
}

function ModuleDetail({ module }: { module: IntelligenceModule }) {
	return (
		<div className="px-5 pb-4 pl-10">
			<div className="rounded-lg border border-white/[0.04] bg-[#181818]/70 p-4">
				<div className="mb-3 flex items-center gap-2">
					<LineChart className="h-3.5 w-3.5 text-white/25" aria-hidden="true" />
					<p className="font-mono text-[11px] text-white/30 uppercase tracking-wider">
						{module.detailTitle}
					</p>
				</div>
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
					{module.metrics.map((metric) => (
						<div
							key={`${module.id}-${metric.label}`}
							className="rounded-md border border-white/[0.03] bg-[#1e1e1e]/70 p-3"
						>
							<p className="font-mono text-[10px] text-white/35">
								{metric.label}
							</p>
							<p
								className={`mt-1 font-mono font-medium text-[13px] ${
									toneTextClass[metric.tone ?? "neutral"]
								}`}
							>
								{metric.value}
							</p>
							{metric.change ? (
								<p
									className={`mt-0.5 font-mono text-[11px] ${
										toneTextClass[metric.tone ?? "neutral"]
									}`}
								>
									{metric.change}
								</p>
							) : null}
							{metric.note ? (
								<p className="mt-2 text-[10px] text-white/25">{metric.note}</p>
							) : null}
						</div>
					))}
				</div>
				<p className="mt-3 text-[11px] text-white/35 leading-relaxed">
					{module.detailText}
				</p>
			</div>
		</div>
	);
}
