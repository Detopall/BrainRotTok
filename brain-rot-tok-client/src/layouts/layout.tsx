import { ReactNode } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";

type LayoutProps = {
	title: string;
	description: string;
	children: ReactNode;
};

function Layout({ title, description, children }: LayoutProps) {
	return (
		<Card className="w-full max-w-3xl mx-auto mt-6 p-6 shadow-lg rounded-xl">
			<CardHeader>
				<h1 className="text-2xl font-bold text-center text-white">
					{title}
				</h1>
			</CardHeader>
			<CardBody>
				<p className="text-center mb-4">{description}</p>
				<div className="p-4 rounded-lg">{children}</div>
			</CardBody>
		</Card>
	);
}

export default Layout;
