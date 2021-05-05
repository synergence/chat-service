
/**
 * Code to talk to topbar and maintain set/get core backwards compatibility stuff
 */
export interface ClientSignal<Arguments extends Array<any>> {
	fire(...args: Arguments): void;
	connect(callback: (...args: Arguments) => void): RBXScriptSignal;
	wait(): void;
}

export interface ClientChatMain {
	TopbarEnabled: boolean;
	MessageCount: boolean;
	Visible: boolean;
	IsCoreGuiEnabled: boolean;

	ToggleVisibility(): void;
	SetVisible(visible: boolean): void;
	FocusChatBar(): void;
	EnterWhisperState(player: Player): void;
	GetVisibility(): boolean;
	GetMessageCount(): number;
	TopbarEnabledChanged(enabled: boolean): void;
	IsFocused(useWasFocused?: unknown): boolean;

	ChatBarFocusChanged: ClientSignal<[boolean]>;
	VisibilityStateChanged: ClientSignal<[boolean]>;
	MessagesChanged: ClientSignal<[number]>;

	MessagePosted: ClientSignal<[string]>;
	CoreGuiEnabled: ClientSignal<[boolean]>;

	ChatMakeSystemMessageEvent: ClientSignal<Array<unknown>>;
	ChatWindowPositionEvent: ClientSignal<[UDim2]>;
	ChatWindowSizeEvent: ClientSignal<[UDim2]>;
	ChatBarDisabledEvent: ClientSignal<[boolean]>;

	fChatWindowPosition(): UDim2;
	fChatWindowSize(): UDim2;
	fChatBarDisabled(): boolean;

	SpecialKeyPressed(key: Enum.SpecialKey, modifiers?: unknown): void;
}

// roblox-ts complains if this isn't here
export default {};