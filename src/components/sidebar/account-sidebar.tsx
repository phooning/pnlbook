import {
	equityPositions,
	optionPositions,
	type PositionSeed,
} from "#/data/bootstrap.ts";

export function AccountSidebar() {
	return (
		<aside className="flex shrink-0 flex-col gap-6 border-neutral-800 border-b bg-neutral-950/50 p-5 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:overflow-y-auto lg:border-r lg:border-b-0">
			<div>
				<h1 className="font-bold text-white text-xl">PnLBook</h1>
				<p className="text-neutral-500 text-xs uppercase tracking-wider">
					Account Overview
				</p>
			</div>

			<div className="space-y-2 border-neutral-800 border-b pb-4">
				<div className="flex justify-between text-sm">
					<span className="text-neutral-400">Equity</span>
					<span className="font-medium text-white">$152,450.32</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-neutral-400">Cash</span>
					<span className="font-medium text-white">$25,230.00</span>
				</div>
				<div className="mt-2 flex justify-between border-neutral-800 border-t pt-1 text-sm">
					<span className="text-neutral-400">Total P&L</span>
					<span className="font-medium text-green-500">+$4,102.55</span>
				</div>
			</div>

			<div>
				<h3 className="mb-3 text-neutral-500 text-xs uppercase tracking-wider">
					Equity Positions
				</h3>
				<div className="space-y-2">
					{equityPositions.map((position) => (
						<PositionRow key={position.symbol} position={position} />
					))}
				</div>
			</div>

			<div>
				<h3 className="mb-3 text-neutral-500 text-xs uppercase tracking-wider">
					Options Contracts
				</h3>
				<div className="space-y-2">
					{optionPositions.map((position) => (
						<PositionRow key={position.symbol} position={position} />
					))}
				</div>
			</div>
		</aside>
	);
}

function PositionRow({ position }: { position: PositionSeed }) {
	const pnl = (position.lastPrice - position.averagePrice) * position.quantity;
	const pnlColor = pnl > 0 ? "text-green-500" : "text-red-500";

	return (
		<div className="flex items-center justify-between rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs">
			<div>
				<div className="font-medium text-white">{position.symbol}</div>
				<div className="text-neutral-500">
					{position.quantity} @ ${position.averagePrice.toFixed(2)}
				</div>
			</div>
			<div className="text-right">
				<div className="text-white">${position.lastPrice.toFixed(2)}</div>
				<div className={pnlColor}>
					{pnl > 0 ? "+" : ""}
					{pnl.toFixed(2)}
				</div>
			</div>
		</div>
	);
}
