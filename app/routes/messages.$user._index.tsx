import { useParams } from "@remix-run/react";
import { Circle } from "lucide-react";
import {
	type Message,
	MessagesContainer,
	SendMessage,
} from "~/components/send-message";

const messages: Message[] = [
	{ from: "me", text: "wsp man" },
	{ from: "them", text: "hey dude" },
	{ from: "me", text: "get on fr homie" },
	{ from: "them", text: "aight bro" },
	{ from: "them", text: "gotchu" },
	{ from: "me", text: "you on?" },
	{
		from: "me",
		text: "long as flipping message right here iskudf siudhf iusdhfushdfisudhf",
	},
	{ type: "separator", date: "Today" },
	{ from: "them", text: "u weird asf" },
];

export default function Messages() {
	const params = useParams();

	const username = params.user;

	return (
		<div className="flex flex-grow flex-col overflow-hidden">
			<div className="mr-4 ml-8">
				<h1 className="font-bold font-minecraft text-xl leading-5">
					{username}
				</h1>
				<p className="flex items-center gap-2 text-muted-foreground text-xs italic">
					<Circle
						className="min-w-fit fill-green-500 text-green-500"
						size={6}
					/>
					Online, Playing on Hypixel
				</p>
			</div>
			<div className="mt-4 grid flex-grow grid-rows-[1fr_auto] overflow-hidden">
				<MessagesContainer messages={messages} />
				<SendMessage />
			</div>
		</div>
	);
}
