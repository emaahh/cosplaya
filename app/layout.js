import { Inter } from 'next/font/google'
import './globals.css'
import localFont from 'next/font/local'

import { Toaster } from "@/components/ui/toaster"



const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'CosPlaya',
	description: 'testttt',
}

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
}

export default function RootLayout({ children }) {
	return (
		<html lang="it">
			<body className={inter.className}>
				<div className="">
					<div className="inline-flex flex-col items-center align-middle w-screen">
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold pt-5 " style={{fontFamily:'huglove'}}>CosPlaya</h1>
						<p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm pb-5">Cos for Fan & Cos for Player</p>
					</div>
				</div>
				{children}
				<Toaster />
			</body>
		</html>
	)
}