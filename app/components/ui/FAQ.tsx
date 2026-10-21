import { FaCircleQuestion, FaPlus } from "react-icons/fa6";

const faqs = [
	{
		question: "Is it free to use DownloadGram?",
		answer: "Yes, DownloadGram is completely free. We don't have any hidden costs, subscriptions, or limits on the number of downloads.",
	},
	{
		question: "Do I need to install any software?",
		answer: "No, DownloadGram is a web-based tool. It works in any modern browser on mobile, tablet, or desktop - no installation needed.",
	},
	{
		question: "Can I download videos from private accounts?",
		answer: "Currently, DownloadGram only supports content from public Instagram accounts to respect user privacy and platform security.",
	},
	{
		question: "Is it anonymous to download stories?",
		answer: "Yes! When you use DownloadGram to save a story, the uploader will not be notified and your identity remains completely anonymous.",
	},
	{
		question: "Where are my files saved after downloading?",
		answer: "On mobile, files go to your 'Downloads' folder or 'Photos' app. On desktop, they are saved to your default browser download location.",
	},
	{
		question: "Can I download Instagram audio/MP3?",
		answer: "Yes, when you paste a video link, our tool gives you the option to download just the audio track in high-quality MP3 format.",
	},
];

export default function FAQ() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-12 lg:px-0 lg:py-24" aria-labelledby="faq-heading" id="faq">
			<div className="text-center">
				<div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-linear-to-r from-red-500 to-violet-400 px-4 py-2 text-white">
					<FaCircleQuestion aria-hidden="true" />
					<span className="text-sm font-semibold">FAQ</span>
				</div>
				<h2 id="faq-heading" className="mt-4 text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
				<p className="mt-2 text-gray-600">Quick answers about DownloadGram.</p>
			</div>
			<div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
				{faqs.map((faq) => (
					<article key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
						<div className="flex items-start justify-between gap-4">
							<h3 className="font-bold leading-6 text-gray-800">{faq.question}</h3>
							<FaPlus className="mt-1 shrink-0 text-red-500" aria-hidden="true" />
						</div>
						<p className="mt-4 text-sm leading-6 text-gray-600">{faq.answer}</p>
					</article>
				))}
			</div>
		</section>
	);
}
