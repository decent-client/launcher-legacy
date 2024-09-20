import { invoke } from "@tauri-apps/api/core";
import { ChevronRight, Folder, FolderGit2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import type { Settings } from "~/lib/constants/settings";
import { cn } from "~/lib/utils";

export function Advanced({
	className,
	formData,
}: { className?: string; formData: UseFormReturn<Settings> }) {
	return (
		<form
			className={cn(
				"mt-4 mb-12 ml-4 flex flex-col space-y-8 overflow-hidden pr-4",
				className,
			)}
		>
			<div className="space-y-4">
				<FormField
					control={formData.control}
					name="advanced.gameDirectory"
					render={() => (
						<FormItem>
							<div className="flex justify-between gap-4">
								<div>
									<FormLabel className="font-bold text-base leading-4">
										Game Directory
									</FormLabel>
									<Tooltip>
										<TooltipTrigger asChild>
											<FormDescription>
												<button
													type="button"
													className="ml-1 flex items-center gap-1 font-medium text-blue-500 leading-[0.8rem]"
													onClick={(event) => {
														event.preventDefault();
														invoke("view_directory", {
															path: formData.getValues(
																"advanced.gameDirectory",
															),
														});
													}}
												>
													<ChevronRight
														className="stroke-muted-foreground"
														size={14}
													/>
													{formData.getValues("advanced.gameDirectory")}\
												</button>
											</FormDescription>
										</TooltipTrigger>
										<TooltipContent>
											Which directory to launch the game from.
										</TooltipContent>
									</Tooltip>
								</div>
								<FormControl>
									<Button
										className="min-w-40 gap-2 border border-input bg-accent/50 text-foreground hover:bg-accent/75"
										onClick={(event) => {
											event.preventDefault();

											async function handleSelect() {
												// const selected = await selectDirectory({
												//   directory: true,
												//   multiple: false,
												//   defaultPath: await configDir(),
												// });
												// if (!Array.isArray(selected) && selected !== null) {
												//   form.setValue("advanced.gameDirectory", selected);
												// }
											}

											handleSelect();
										}}
									>
										<Folder size={16} />
										Browse
									</Button>
								</FormControl>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={formData.control}
					name="advanced.javaPath"
					render={() => (
						<FormItem>
							<div className="flex justify-between gap-4">
								<div>
									<FormLabel className="font-bold text-base">
										Java Path
									</FormLabel>
									<Tooltip>
										<TooltipTrigger asChild>
											<FormDescription>
												<button
													type="button"
													className="ml-1 flex items-center gap-1 font-medium text-blue-500 leading-[0.8rem]"
													onClick={(event) => {
														event.preventDefault();
														invoke("view_directory", {
															path: formData.getValues("advanced.javaPath"),
														});
													}}
												>
													<ChevronRight
														className="stroke-muted-foreground"
														size={14}
													/>
													{formData.getValues("advanced.javaPath")}\
												</button>
											</FormDescription>
										</TooltipTrigger>
										<TooltipContent>
											Path to the Java executable.
										</TooltipContent>
									</Tooltip>
								</div>
								<FormControl>
									<Button
										className="min-w-40 gap-2 border border-input bg-accent/50 text-foreground hover:bg-accent/75"
										onClick={(event) => {
											event.preventDefault();

											async function handleSelect() {
												// const selected = await selectDirectory({
												//   directory: true,
												//   multiple: false,
												//   defaultPath: await appDataDir(),
												// });
												// if (!Array.isArray(selected) && selected !== null) {
												//   form.setValue("advanced.javaPath", selected);
												// }
											}

											handleSelect();
										}}
									>
										<Folder size={16} />
										Browse
									</Button>
								</FormControl>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<FormField
				control={formData.control}
				name="advanced.branch"
				render={({ field }) => (
					<FormItem className="flex-grow">
						<div className="flex justify-between gap-4">
							<div>
								<FormLabel className="font-bold text-base">Branch</FormLabel>
								<FormDescription>
									The github repository branch to use for the launcher.
								</FormDescription>
								<FormMessage />
							</div>
							<FormItem className="space-y-0">
								<FormControl>
									<div className="flex items-center gap-3">
										<FolderGit2 className="stroke-muted-foreground" size={18} />
										<Input
											className="w-36 placeholder:text-muted-foreground"
											{...field}
											placeholder="master"
										/>
									</div>
								</FormControl>
							</FormItem>
						</div>
					</FormItem>
				)}
			/>
			<FormField
				control={formData.control}
				name="advanced.updatePreferences"
				render={({ field: { value, onChange } }) => (
					<FormItem>
						<div className="flex justify-between gap-4">
							<div>
								<FormLabel className="font-bold text-base">
									Launcher Update Preference
								</FormLabel>
								<FormDescription>
									When you want to receive updates for the launcher.
								</FormDescription>
							</div>
							<FormControl>
								<Select
									onValueChange={onChange}
									defaultValue={value}
									value={value}
								>
									<SelectTrigger className="w-48">
										<SelectValue placeholder={value} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="early">Early (Opt-in)</SelectItem>
										<SelectItem value="normal">Normal (Stable)</SelectItem>
										<SelectItem value="late">Late (Opt-out)</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={formData.control}
				name="advanced.JVMArguments"
				render={({ field }) => (
					<FormItem className="space-y-1 pb-4">
						<FormLabel
							className="font-bold text-base aria-disabled:text-muted-foreground"
							aria-disabled
						>
							JVM Arguments
						</FormLabel>
						<FormControl>
							<Input
								className="mt-2 placeholder:text-muted-foreground"
								{...field}
								disabled
							/>
						</FormControl>
						<FormDescription>
							Additional arguments to pass when launching the game.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className="space-y-4">
				<FormField
					control={formData.control}
					name="advanced.hardwareAcceleration"
					render={({ field: { value, onChange } }) => (
						<FormItem className="space-y-0">
							<div className="flex items-center gap-x-4">
								<FormControl>
									<Switch
										className="data-[state=checked]:bg-green-500"
										checked={value}
										onCheckedChange={onChange}
									/>
								</FormControl>
								<div className="flex flex-grow items-center justify-between">
									<FormLabel className="font-bold text-base">
										Hardware Acceleration
									</FormLabel>
									{/* {form.getValues("advanced.hardwareAcceleration") !==
                        hardwareAcceleration && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="h-6 translate-x-2 gap-2 px-2 text-sm text-red-500"
                              variant={"secondary"}
                              size={"sm"}
                              onClick={(event) => {
                                event.preventDefault();
                                // window.electron.ipcRenderer.send(
                                //   "restart-application",
                                // );
                              }}
                            >
                              Restart <RotateCw size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="mx-1">
                            <p className="px-2 py-0.5">
                              Restart the launcher for the changes to take
                              effect
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )} */}
								</div>
							</div>
							<FormDescription className="ml-[calc(36px+1rem)]">
								Whether to use hardware acceleration for the launcher.
								<br />
								<span className="italic">
									Enabling this maybe effect your preformance.
								</span>
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={formData.control}
					name="advanced.reducedAnimations"
					render={({ field: { value, onChange } }) => (
						<FormItem className="space-y-0">
							<div className="flex items-center gap-x-4">
								<FormControl>
									<Switch
										className="data-[state=checked]:bg-green-500"
										checked={value}
										onCheckedChange={(checked) => {
											onChange(checked);
											//   debounceReload();
										}}
									/>
								</FormControl>
								<FormLabel className="font-bold text-base">
									Reduce Animations
								</FormLabel>
							</div>
							<FormDescription className="ml-[calc(36px+1rem)]">
								Whether the launcher should render animations.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={formData.control}
					name="advanced.displayTooltips"
					render={({ field: { value, onChange } }) => (
						<FormItem className="space-y-0">
							<div className="flex items-center gap-x-4">
								<FormControl>
									<Switch
										className="data-[state=checked]:bg-green-500"
										checked={value}
										onCheckedChange={(checked) => {
											onChange(checked);
											//   debounceReload();
										}}
									/>
								</FormControl>
								<FormLabel className="font-bold text-base">
									Display Tooltips
								</FormLabel>
							</div>
							<FormDescription className="ml-[calc(36px+1rem)]">
								Whether the launcher should display helping tooltips.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</form>
	);
}
