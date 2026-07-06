import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import { workspaceColorScheme } from "#/constants/color-scheme.ts";
import { calendarPnl } from "#/data/bootstrap.ts";
import { cn } from "#/lib/utils.ts";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CALENDAR_CELL_COUNT = 42;

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	year: "numeric",
});

const seededPnlByDate = new Map(
	calendarPnl.map((entry) => [entry.date, entry.pnl]),
);

type CalendarCell = {
	key: string;
	day: number | null;
	pnl: number;
	isEmpty: boolean;
	isToday: boolean;
	isWeekend: boolean;
};

export function PnlCalendar() {
	const [currentMonth, setCurrentMonth] = useState(getInitialCalendarMonth);
	const year = currentMonth.getFullYear();
	const month = currentMonth.getMonth();
	const calendarCells = useMemo(
		() => getCalendarCells(year, month),
		[year, month],
	);
	const weeks = useMemo(() => getWeeks(calendarCells), [calendarCells]);
	const monthTotal = useMemo(() => getMonthTotal(year, month), [year, month]);
	const previousMonth = new Date(year, month - 1, 1);
	const previousMonthYear = previousMonth.getFullYear();
	const previousMonthIndex = previousMonth.getMonth();
	const previousMonthTotal = useMemo(
		() => getMonthTotal(previousMonthYear, previousMonthIndex),
		[previousMonthYear, previousMonthIndex],
	);
	const previousYearTotal = useMemo(
		() => getMonthTotal(year - 1, month),
		[year, month],
	);
	const isCurrentMonth =
		year === new Date().getFullYear() && month === new Date().getMonth();

	const goToPreviousMonth = () => {
		setCurrentMonth(
			(selectedMonth) =>
				new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1),
		);
	};

	const goToNextMonth = () => {
		setCurrentMonth(
			(selectedMonth) =>
				new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1),
		);
	};

	const goToToday = () => {
		const today = new Date();

		setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
	};

	return (
		<section id="pnl-calendar" className="mb-10 scroll-mt-4">
			<div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
				<div className="flex flex-wrap items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="icon-sm"
						className="border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-900 hover:text-white"
						aria-label="Previous month"
						onClick={goToPreviousMonth}
					>
						<ChevronLeft />
					</Button>
					<h2 className="w-48 text-center font-semibold text-white text-xl">
						{monthFormatter.format(currentMonth)}
					</h2>
					<Button
						type="button"
						variant="outline"
						size="icon-sm"
						className="border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-900 hover:text-white"
						aria-label="Next month"
						onClick={goToNextMonth}
					>
						<ChevronRight />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="ml-1 border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-900 hover:text-white"
						disabled={isCurrentMonth}
						onClick={goToToday}
					>
						<CalendarDays />
						Today
					</Button>
				</div>

				<div className="flex flex-wrap gap-5 text-left xl:justify-end xl:text-right">
					<div className="min-w-32 border-neutral-800 border-r pr-5">
						<div className="font-medium text-[10px] text-neutral-500 uppercase tracking-wider">
							Month P&L
						</div>
						<div
							className={cn("font-semibold text-lg", valueColor(monthTotal))}
						>
							{formatCurrency(monthTotal)}
						</div>
					</div>
					<div className="min-w-32 border-neutral-800 border-r pr-5">
						<div className="font-medium text-[10px] text-neutral-500 uppercase tracking-wider">
							MoM Change
						</div>
						<div
							className={cn(
								"font-medium text-sm",
								valueColor(monthTotal - previousMonthTotal),
							)}
						>
							{formatCurrency(monthTotal - previousMonthTotal)}
						</div>
						<div className="text-[10px] text-neutral-500">
							{formatPercent(monthTotal, previousMonthTotal)}
						</div>
					</div>
					<div className="min-w-32">
						<div className="font-medium text-[10px] text-neutral-500 uppercase tracking-wider">
							YoY Change
						</div>
						<div
							className={cn(
								"font-medium text-sm",
								valueColor(monthTotal - previousYearTotal),
							)}
						>
							{formatCurrency(monthTotal - previousYearTotal)}
						</div>
						<div className="text-[10px] text-neutral-500">
							{formatPercent(monthTotal, previousYearTotal)}
						</div>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto rounded-md border border-neutral-800 bg-neutral-950/60">
				<div className="min-w-[760px]">
					<div className="grid grid-cols-[repeat(7,minmax(0,1fr))_7rem] border-neutral-800 border-b">
						{WEEKDAY_LABELS.map((day) => (
							<div
								key={day}
								className="border-neutral-800 border-r py-2 text-center font-medium text-[10px] text-neutral-500 uppercase tracking-wider last:border-r-0"
							>
								{day}
							</div>
						))}
						<div className="bg-neutral-900/40 py-2 text-center font-medium text-[10px] text-neutral-500 uppercase tracking-wider">
							Week P&L
						</div>
					</div>

					<div>
						{weeks.map((week, weekIndex) => {
							const weekPnl = week.reduce((total, cell) => total + cell.pnl, 0);
							const weekKey = week[0]?.key ?? `${year}-${month}-week`;

							return (
								<div
									key={weekKey}
									className="grid grid-cols-[repeat(7,minmax(0,1fr))_7rem] border-neutral-800 border-b last:border-b-0"
								>
									{week.map((cell) => {
										if (cell.isEmpty) {
											return (
												<div
													key={cell.key}
													className="h-24 border-neutral-800 border-r bg-neutral-900/20"
												/>
											);
										}

										return (
											<div
												key={cell.key}
												className={cn(
													"flex h-24 flex-col justify-between border-neutral-800 border-r p-2 transition-colors",
													cell.pnl > 0 &&
														"bg-green-500/5 hover:bg-green-500/10",
													cell.pnl < 0 && "bg-red-500/5 hover:bg-red-500/10",
													cell.pnl === 0 && "hover:bg-neutral-900/60",
													cell.isWeekend && "bg-neutral-900/30",
													cell.isToday && "ring-1 ring-inset ring-sky-400/60",
												)}
											>
												<div
													className={cn(
														"font-medium text-xs",
														cell.isWeekend
															? "text-neutral-600"
															: "text-neutral-400",
														cell.isToday && "text-sky-300",
													)}
												>
													{cell.day}
												</div>
												{cell.pnl !== 0 ? (
													<div
														className={cn(
															"font-medium text-xs",
															valueColor(cell.pnl),
														)}
													>
														{formatCurrency(cell.pnl)}
													</div>
												) : null}
											</div>
										);
									})}
									<div
										className={cn(
											"flex h-24 items-center justify-center bg-neutral-900/40 px-2",
											weekPnl > 0 && "border-green-500/30 border-l-2",
											weekPnl < 0 && "border-red-500/30 border-l-2",
										)}
									>
										<div className="text-center">
											<div className="font-medium text-[10px] text-neutral-500 uppercase">
												Week {weekIndex + 1}
											</div>
											<div
												className={cn(
													"font-semibold text-xs",
													valueColor(weekPnl),
												)}
											>
												{weekPnl === 0 ? "Flat" : formatCurrency(weekPnl)}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}

function getInitialCalendarMonth() {
	const seedDate = parseDateKey(calendarPnl[0]?.date);
	const baseDate = seedDate ?? new Date();

	return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
}

function parseDateKey(dateKey: string | undefined) {
	if (!dateKey) {
		return null;
	}

	const [year, month, day] = dateKey.split("-").map(Number);
	if (!year || !month || !day) {
		return null;
	}

	return new Date(year, month - 1, day);
}

function getDateKey(year: number, month: number, day: number) {
	return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getMockPnL(year: number, month: number, day: number) {
	const dayOfWeek = new Date(year, month, day).getDay();

	if (dayOfWeek === 0 || dayOfWeek === 6) {
		return 0;
	}

	const seed = year * 10000 + (month + 1) * 100 + day;
	const pnl = Math.round((Math.sin(seed) * 10000) / 5);

	return Math.abs(pnl) < 100 ? 0 : pnl;
}

function getDailyPnl(year: number, month: number, day: number) {
	return (
		seededPnlByDate.get(getDateKey(year, month, day)) ??
		getMockPnL(year, month, day)
	);
}

function getMonthTotal(year: number, month: number) {
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	let total = 0;

	for (let day = 1; day <= daysInMonth; day += 1) {
		total += getDailyPnl(year, month, day);
	}

	return total;
}

function getCalendarCells(year: number, month: number) {
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const today = new Date();
	const todayKey = getDateKey(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	);
	const cells: Array<CalendarCell> = [];

	for (let index = 0; index < firstDayOfMonth; index += 1) {
		cells.push({
			key: `leading-${year}-${month}-${index}`,
			day: null,
			pnl: 0,
			isEmpty: true,
			isToday: false,
			isWeekend: index === 0 || index === 6,
		});
	}

	for (let day = 1; day <= daysInMonth; day += 1) {
		const dateKey = getDateKey(year, month, day);
		const dayOfWeek = new Date(year, month, day).getDay();

		cells.push({
			key: dateKey,
			day,
			pnl: getDailyPnl(year, month, day),
			isEmpty: false,
			isToday: dateKey === todayKey,
			isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
		});
	}

	while (cells.length < CALENDAR_CELL_COUNT) {
		const dayOfWeek = cells.length % 7;

		cells.push({
			key: `trailing-${year}-${month}-${cells.length}`,
			day: null,
			pnl: 0,
			isEmpty: true,
			isToday: false,
			isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
		});
	}

	return cells;
}

function getWeeks(cells: Array<CalendarCell>) {
	const weeks = [];

	for (let index = 0; index < cells.length; index += 7) {
		weeks.push(cells.slice(index, index + 7));
	}

	return weeks;
}

function formatCurrency(value: number) {
	const formattedValue = currencyFormatter.format(Math.abs(value));

	if (value > 0) {
		return `+${formattedValue}`;
	}

	if (value < 0) {
		return `-${formattedValue}`;
	}

	return formattedValue;
}

function formatPercent(current: number, previous: number) {
	if (previous === 0) {
		return "0.00%";
	}

	const percent = ((current - previous) / Math.abs(previous)) * 100;

	return `${percent > 0 ? "+" : ""}${percent.toFixed(2)}%`;
}

function valueColor(value: number, neutral = "text-neutral-500") {
	if (value > 0) {
		return workspaceColorScheme.accentText;
	}

	if (value < 0) {
		return workspaceColorScheme.negativeText;
	}

	return neutral;
}
