import { ReactElement } from "react";

import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

import { env } from "@/env.mjs";

const transport = nodemailer.createTransport(env.EMAIL_SERVER);

export const sendEmail = ({
	template,
	...options
}: Omit<MailOptions, "html"> &
	Required<Pick<MailOptions, "subject">> & { template: ReactElement }) => {
	const html = render(template);
	return transport.sendMail({
		from: "Crimplex <crimplex.mailer@gmail.com>",
		html,
		...options,
	});
};

export const previewEmailRoute = async (
	req: Request,
	{
		params,
	}: {
		params: { options: [string, string?] };
	},
) => {
	// Allows debug only in development
	if (env.NODE_ENV !== "development") {
		return new Response(undefined, {
			status: 404,
		});
	}

	const [template] = params.options;
	const query = req.url.split("?")[1];
	const searchQuery = Object.fromEntries(new URLSearchParams(query ?? ""));

	let Email: () => JSX.Element;
	try {
		const EmailModule = await import(`@/features/emails/templates/${template}`);
		Email = EmailModule.default;
	} catch {
		return new Response("Template not found", {
			status: 404,
		});
	}

	const html = render(<Email {...searchQuery} />);

	return new Response(html, {
		status: 200,
		headers: {
			"Content-Type": "text/html",
		},
	});
};
