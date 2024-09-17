"use client";

import { Send } from "lucide-react";
import { forwardRef, useRef } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

export type Message =
	| { from: "me" | "them"; text: string }
	| { type: "separator"; date: string };

export const SendMessage = forwardRef<
	HTMLTextAreaElement,
	React.HTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleInput = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	return (
		<div className={cn("relative mx-2 mb-2", className)}>
			<Textarea
				ref={ref}
				className="resize-none bg-secondary/75 font-minecraft"
				placeholder="Send a message..."
				onInput={handleInput}
				autoComplete="off"
				rows={1}
				autoFocus
				{...props}
			/>
			<Button
				className="absolute top-1 right-1"
				variant={"ghost"}
				size={"icon"}
			>
				<Send size={16} />
			</Button>
		</div>
	);
});
SendMessage.displayName = "SendMessage";

export function MessagesContainer({
	messages,
	className,
}: {
	messages: Message[];
	className?: string;
}) {
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	return (
		<ScrollArea
			ref={scrollAreaRef}
			className={cn("mb-2 flex flex-col", className)}
			style={{
				maskImage: "linear-gradient(to bottom, transparent, black 20px)",
			}}
			hideScrollBar
		>
			<Messages className="mb-2" messages={messages} />
		</ScrollArea>
	);
}

function NewMessagesNotifications({
	date,
	className,
}: {
	date: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"my-2 grid grid-cols-[2rem_auto_1fr] place-items-center gap-2",
				className,
			)}
		>
			<Separator className="bg-red-500" />
			<span className="text-red-500 text-sm">New Messages, sent {date}</span>
			<Separator className="bg-red-500" />
		</div>
	);
}

function Messages({
	messages,
	className,
}: {
	messages: Message[];
	className?: string;
}) {
	let previousMessageFrom: "me" | "them" | null = null;

	return (
		<div className={cn(className)}>
			{messages.map((message, index) => {
				if ("type" in message && message.type === "separator") {
					return (
						<NewMessagesNotifications
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							className="mt-4 mb-2"
							date={message.date}
						/>
					);
				}

				if ("from" in message) {
					const isLastFromSameUser = previousMessageFrom === message.from;
					previousMessageFrom = message.from;

					if (message.from === "them") {
						return (
							<FromThem // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className={cn(isLastFromSameUser ? "mt-1" : "mt-4")}
								message={message.text}
							/>
						);
					}

					return (
						<FromMe // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							className={cn(isLastFromSameUser ? "mt-1" : "mt-4")}
							message={message.text}
						/>
					);
				}
			})}
		</div>
	);
}

function FromThem({
	message,
	className,
}: {
	message: string;
	className?: string;
}) {
	return (
		<div className={cn("mt-2 mr-24 ml-4 flex justify-start", className)}>
			<div className="flex flex-col rounded-xl bg-zinc-600 px-3 py-1.5 drop-shadow-from-them">
				<p className="font-minecraft text-sm">{message}</p>
			</div>
		</div>
	);
}

function FromMe({
	message,
	className,
}: {
	message: string;
	className?: string;
}) {
	return (
		<div className={cn("mt-2 mr-4 ml-24 flex justify-end", className)}>
			<div className="flex flex-col rounded-xl bg-blue-500 px-3 py-1.5 drop-shadow-from-me">
				<p className="font-minecraft text-sm">{message}</p>
			</div>
		</div>
	);
}
