'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function LeadCapture() {
	return (
		<Card className="border border-slate-200 bg-white shadow-sm">
			<CardHeader className="border-b border-slate-100">
				<CardTitle className="text-slate-900">
					Unlock Your Full Vendor Switch Guide
				</CardTitle>
			</CardHeader>

			<CardContent>
				<form className="space-y-6" method="post" noValidate>
					<div className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="lead-email" className="text-xs font-semibold tracking-wider text-slate-700 uppercase">
								Work Email
							</label>
							<Input
								id="lead-email"
								name="email"
								type="email"
								required
								autoComplete="email"
								placeholder="you@company.com"
								className="border-b-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:border-b-slate-900"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="lead-company" className="text-xs font-semibold tracking-wider text-slate-700 uppercase">
								Company Name
							</label>
							<Input
								id="lead-company"
								name="companyName"
								type="text"
								autoComplete="organization"
								placeholder="Optional"
								className="border-b-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:border-b-slate-900"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="lead-role" className="text-xs font-semibold tracking-wider text-slate-700 uppercase">
								Your Role
							</label>
							<Input
								id="lead-role"
								name="role"
								type="text"
								autoComplete="organization-title"
								placeholder="Optional"
								className="border-b-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:border-b-slate-900"
							/>
						</div>
					</div>

					<div
						className="absolute h-px w-px overflow-hidden whitespace-nowrap"
						style={{
							clip: 'rect(0 0 0 0)',
							clipPath: 'inset(50%)',
							margin: '-1px',
						}}
						aria-hidden="true"
					>
						<label htmlFor="website">Leave this field blank</label>
						<input
							id="website"
							name="website"
							type="text"
							tabIndex={-1}
							autoComplete="off"
							defaultValue=""
						/>
					</div>

					<Button
						type="submit"
						className="w-full bg-slate-900 text-white hover:bg-slate-800"
						size="lg"
					>
						Get My Full Guide
					</Button>

					<p className="text-sm text-slate-500">
						We&apos;ll email you this report and notify you of new optimizations for your stack.
					</p>
				</form>
			</CardContent>
		</Card>
	)
}
