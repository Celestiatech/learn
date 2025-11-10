import { useState } from 'react'
import Link from 'next/link'

export default function OnboardingModal({ open, onClose }: { open: boolean; onClose: ()=>void }){
	if(!open) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
			<div className="relative w-full max-w-xl rounded-2xl border border-soft bg-surface-card p-6 shadow-soft">
				<h2 className="text-xl font-semibold text-heading">Welcome — quick start</h2>
				<p className="mt-3 text-secondary">Pick a track and try a 5-minute lesson. Use the playground to run code instantly.</p>
				<ol className="mt-4 list-decimal pl-5 space-y-2 text-secondary">
					<li>Choose a track (Web is a great start).</li>
					<li>Open the intro lesson and press Run in the playground.</li>
					<li>Complete the micro-challenge to earn your first badge.</li>
				</ol>
				<div className="mt-6 flex justify-end gap-3">
					<button className="rounded-full border border-soft px-4 py-2 text-xs font-semibold tracking-[0.14em] text-secondary transition hover:border-strong hover:text-heading" onClick={onClose}>
						Maybe later
					</button>
					<Link
						href="/lessons/intro"
						className="rounded-full bg-[var(--gradient-brand-alt)] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-white shadow-soft transition hover:brightness-110"
					>
						Start the intro
					</Link>
				</div>
			</div>
		</div>
	)
}
