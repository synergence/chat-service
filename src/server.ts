
type MessageTypeDefault = 'Message';
type MessageTypeSystem = 'System';
type MessageTypeMeCommand = 'MeCommand';
type MessageTypeWelcome = 'Welcome';
type MessageTypeSetCore = 'SetCore';
type MessageTypeWhisper = 'Whisper';

export type MessageType = MessageTypeDefault | MessageTypeSystem | MessageTypeMeCommand | MessageTypeWelcome | MessageTypeSetCore | MessageTypeWhisper;

export interface ChatTag {
	TagText?: string;
	TagColor?: Color3;
}

interface ExtraDataFull {
	ChatColor: Color3;
	NameColor: Color3;
	Font: Enum.Font;
	TextSize: number;
	Tags: Array<ChatTag>;
}
export type ExtraData = Partial<ExtraDataFull>;

/**
 * ChatService is a singleton object that handles the server-side behavior of the Lua Chat System, namely ChatChannels and ChatSpeakers.
 * All ModuleScripts within the ChatModules Folder should return a function; that function will be called with the ChatService singleton (this object).
 */
export interface ChatService {
	//! PROPERTIES

	/**
	 * @deprecated
	 * Undocumented
	 */
	readonly MessageIdCounter: number;

	/**
	 * @deprecated
	 * Undocumented
	 */
	readonly ChatServiceMajorVersion: number;

	/**
	 * @deprecated
	 * Undocumented
	 */
	readonly ChatServiceMinorVersion: number;

	//! METHODS

	/**
	 * Creates a ChatChannel object with the given name and returns it.
	 */
	AddChannel(channelName: string, autoJoin?: boolean): ChatChannel;

	/**
	 * Remove a channel with the given name
	 */
	RemoveChannel(channelName: string): void;

	/**
	 * Returns the channel with the given name, or nil if it does not exist.
	 */
	GetChannel(channelName: string): ChatChannel;

	/**
	 * Create and add a speaker to the chat with the given name, then returns it.
	 */
	AddSpeaker(speakerName: string): ChatSpeaker;

	/**
	 * Removes the speaker from the chat with the given name.
	 */
	RemoveSpeaker(speakerName: string): void;

	/**
	 * Returns the speaker with the given name, or nil if it doesn’t exist.
	 */
	GetSpeaker(speakerName: string): ChatSpeaker | undefined;

	/**
	 * @deprecated
	 * Undocumented
	 */
	GetSpeakerList(): Array<string>;

	/**
	 * @deprecated
	 * Undocumented
	 */
	GetSpeakerByUserOrDisplayName(speakerName: string): ChatSpeaker;

	/**
	 * Returns a list of the names of all non-private channels in the chat.
	 */
	GetChannelList(): Array<string>;

	/**
	 * Returns a list of the names of all channels in the chat with AutoJoin set to true.
	 */
	GetAutoJoinChannelList(): Array<string>;

	/**
	 * @deprecated
	 * Undocumented
	 */
	SendGlobalSystemMessage(message: string): void;

	/**
	 * Registers a filter function to the chat identified by functionId. Any changes to the message will persist and be displayed when the message makes it through all of the other filter functions. This function is passed the speaker’s name, the message object, and the channel the message originated in.
	 *
	 * @example
	 * ```lua
	 * -- Paste this example into a ModuleScript within the ChatModules folder.
	 * -- This example filters a keyword, and if successful, sets the chatColor of the message
	 * local functionId = "greenText"
	 * local keyword = "#green"
	 * local chatColor = Color3.new(0, 1, 0) -- green
	 *
	 * local function doFilter(speaker, messageObject, channelName)
	 *     -- Check if the message contains the keyword
	 *     local start, finish = string.find(messageObject.Message, keyword)
	 *     if start and finish then
	 *         -- Remove (filter) the keyword from the message, also setting the ChatColor
	 *         messageObject.Message = string.gsub(messageObject.Message, keyword, "")
	 *         messageObject.ExtraData.ChatColor = chatColor
	 *     end
	 * end
	 *
	 * local function runChatModule(ChatService)
	 *     ChatService:RegisterFilterMessageFunction(functionId, doFilter)
	 * end
	 *
	 * return runChatModule
	 * ```
	 */
	RegisterFilterMessageFunction(functionId: string, func: Callback): void;

	/**
	 * Unregisters a filter function (registered by RegisterFilterMessageFunction) given its identifier, functionId.
	 */
	UnregisterFilterMessageFunction(functionId: string): void;

	/**
	 * Registers a process command function to the chat identified by functionId. Before a message is filtered, it will pass through func (and other functions registered by this). The function func should check whether the message invokes a command. If so, perform the action of the command and return true. Returning true indicates the message was indeed a command and should not be displayed. The function can be unregistered using UnregisterProcessCommandsFunction.
	 */
	RegisterProcessCommandsFunction(functionId: string, func: Callback): void;

	/**
	 * Unregisters a command processor (registered by RegisterProcessCommandsFunction) given the identifier, functionId.
	 */
	UnregisterProcessCommandsFunction(functionId: string): void;

	//! EVENTS

	/**
	 * Fires when a channel is added to the chat.
	 */
	ChannelAdded: RBXScriptSignal<(channelName: string) => void>;

	/**
	 * Fires when a channel is removed from the chat.
	 */
	ChannelRemoved: RBXScriptSignal<(channelName: string) => void>;

	/**
	 * Fires when a speaker is added to the chat.
	 */
	SpeakerAdded: RBXScriptSignal<(speakerName: string) => void>;

	/**
	 * Fires when a speaker is removed from the chat.
	 */
	SpeakerRemoved: RBXScriptSignal<(speakerName: string) => void>;
}

/**
 * ChatChannel is an object that stores data about a single channel, which is a means by which messages can be exchanged between [ChatSpeakers](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker). It also has access permission properties that determine the visibility of messages along with whether users may join or leave the channel manually (using /join or /leave commands).
 *
 * By default, each player has a [ChatSpeaker](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) that is automatically added to the "All" and "System" chat channels (although, "System" is read only). If the player is on a [Team](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) ([Player.Team](https://developer.roblox.com/en-us/api-reference/property/Player/Team) is set), they will also have access to a channel for only that Team. Whisper messages use a channel
 */
export interface ChatChannel {
	//! PROPERTIES

	/**
	 * The name of the channel, used to reference the channel in other functions (such as [ChatService:GetChannel()](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatService), [ChatSpeaker:JoinChannel()](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker), etc.)
	 */
	Name: string;

	/**
	 * A message to display when a player joins the channel.
	 */
	WelcomeMessage: string;

	/**
	 * @deprecated
	 * Undocumented
	 */
	readonly GetWelcomeMessageFunction: (speaker: ChatSpeaker) => void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	readonly ChannelNameColor: Color3;

	/**
	 * @deprecated
	 * Undocumented, use IsSpeakerMuted wherever possible
	 */
	readonly Mutes: ReadonlyMap<string, number>;

	/**
	 * @deprecated
	 * Undocumented
	 */
	readonly MaxHistory: number;

	/**
	 * @deprecated
	 * Undocumented
	 */
	readonly HistoryIndex: number;

	/**
	 * Determines whether a player may manually join a channel using the /join command. A player can still be added to a channel using [ChatSpeaker:JoinChannel()](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) or other means even if this property is false.
	 */
	Joinable: boolean;

	/**
	 * Determines whether a player may manually leave a channel using the /leave command. A player can still be removed from a channel using [ChatSpeaker:LeaveChannel()](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) or other means even if this property is false.
	 */
	Leaveable: boolean;

	/**
	 * Determines whether a player’s [ChatSpeaker](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) will automatically join the channel upon joining the game. Non-player speakers will not automatically join channels, even when this property is true ([ChatSpeaker:JoinChannel()](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) may be used to do this).
	 */
	AutoJoin: boolean;

	/**
	 * Determines whether the channel will be included in the list of channels returned by ChatService:GetChannelList(). This for whisper chats and team chats.
	 */
	Private: boolean;

	//! METHODS

	/**
	 * Removes the speaker with the given speakerName from the channel, sending a message to both the player and the channel from which the player was kicked. If a reason is provided, the reason will be included in the message.
	 */
	KickSpeaker(speakerName: string, reason?: string): void;

	/**
	 * Mutes the speaker with the given speakerName in the channel for a duration specified in seconds. If duration is nil or 0, the mute is indefinite. If reason is provided, then a message will be sent to the channel with the reason included.
	 */
	MuteSpeaker(speakerName: string, reason?: string, duration?: number): void;

	/**
	 * Unmutes the speaker with the given speakerName in the channel.
	 */
	UnmuteSpeaker(speakerName: string, reason?: string, duration?: number): void;

	/**
	 * Describes whether the speaker with the given speakerName is presently muted in the channel.
	 */
	IsSpeakerMuted(speakerName: string): boolean;

	/**
	 * Returns a list containing all if the names of the ChatSpeaker currently in the channel.
	 */
	GetSpeakerList(): Array<string>;

	/**
	 * Sends a message from the "System" [ChatSpeaker](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) to the channel.
	 */
	SendSystemMessage(message: string, extraData?: ExtraData): void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	SendSystemMessageToSpeaker(message: string, speakerName: string, extraData?: ExtraData): void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	SendMessageObjToFilters(message: string, messageObj: ChatMessage, fromSpeaker: ChatSpeaker): void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	CanCommunicateByUserId(userId1: number, userId2: number): boolean;

	/**
	 * @deprecated
	 * Undocumented
	 */
	CanCommunicate(speakerObj1: ChatSpeaker, speakerObj2: ChatSpeaker): boolean;

	/**
	 * @deprecated
	 * Undocumented
	 */
	SendMessageToSpeaker(message: string, speakerName: string, fromSpeakerName: string, extraData?: ExtraData): void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	GetHistoryLog(): Array<string>;

	/**
	 * @deprecated
	 * Undocumented
	 */
	GetHistoryLogForSpeaker(speaker: ChatSpeaker): Array<string>;

	/**
	 * Registers a filter function, func, identified by functionId to the channel. The filter function will be called with the [ChatSpeaker](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker), the [ChatMessage](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatMessage), and the [string](https://developer.roblox.com/en-us/api-reference/lua-docs/string) name of the channel the message originated in. Changes to the message will persist and will be displayed after filtering.
	 *
	 * @example
	 * ```lua
	 * -- Paste this example into a ModuleScript within the ChatModules folder.
	 * -- This example filters a keyword, and if successful, sets the chatColor of the message
	 * local functionId = "greenText"
	 * local keyword = "#green"
	 * local chatColor = Color3.new(0, 1, 0) -- green
	 *
	 * local function doFilter(speaker, messageObject, channelName)
	 *     -- Check if the message contains the keyword
	 *     local start, finish = string.find(messageObject.Message, keyword)
	 *     if start and finish then
	 *         -- Remove (filter) the keyword from the message, also setting the ChatColor
	 *         messageObject.Message = string.gsub(messageObject.Message, keyword, "")
	 *         messageObject.ExtraData.ChatColor = chatColor
	 *     end
	 * end
	 *
	 * local function runChatModule(ChatService)
	 *     -- Create a channel and register the filter function
	 *     local testChannel = ChatService:AddChannel("TestChannel")
	 *     testChannel:RegisterFilterMessageFunction(functionId, doFilter)
	 * end
	 *
	 * return runChatModule
	 * ```
	 */
	RegisterFilterMessageFunction(functionId: string, func: Callback): void;

	/**
	 * Unregisters a filter function (registered by RegisterFilterMessageFunction) given its identifier, functionId.
	 */
	UnregisterFilterFunction(functionId: string): void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	FilterMessageFunctionExists(functionId: string): boolean;

	/**
	 * Registers a process command function, func, identified by functionId to the chat. Before a message is filtered, it will pass through func (and other functions registered by this). The function func should check whether the message invokes a command. If so, perform the action of the command and return true. Returning true indicates the message was indeed a command and should not be displayed. The function can be unregistered using UnregisterProcessCommandsFunction.
	 *
	 * @example
	 * ```lua
	 * -- Paste this example into a ModuleScript within the ChatModules folder.
	 * local functionId = "getPizza"
	 * local command = "/pizza"
	 * local toolId = 22596452 -- Pepperoni pizza slice gear
	 * local function processCommand(speakerName, message, channelName)
	 *     if string.sub(message, 1, command:len()) == command then
	 *         local model = game:GetService("InsertService"):LoadAsset(toolId)
	 *         local tool = model:GetChildren()[1]
	 *         local speaker = ChatService:GetSpeaker(speakerName)
	 *         local player = speaker:GetPlayer()
	 *         tool.Parent = player.Backpack
	 *         return true
	 *     end
	 *     return false
	 * end
 	 *
	 * local function runChatModule(ChatService)
	 *     ChatService:RegisterProcessCommandsFunction(functionId, processCommand)
	 * end
	 *
	 * return runChatModule
	 * ```
	 */
	RegisterProcessCommandsFunction(functionId: string, func: Callback): void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	ProcessCommandsFunctionExists(functionId: string): boolean;

	/**
	 * Unregisters a command processor (registered by RegisterProcessCommandsFunction) given the identifier, functionId.
	 */
	UnregisterProcessCommandsFunction(functionId: string): void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	RegisterGetWelcomeMessageFunction(func: ChatChannel['GetWelcomeMessageFunction']): void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	UnRegisterGetWelcomeMessageFunction(): void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	SetChannelNameColor(color: Color3): void;

	//! EVENTS

	/**
	 * Fires when a message is posted in the channel.
	 */
	MessagePosted: RBXScriptSignal<(message: ChatMessage) => void>;

	/**
	 * Fires when a [ChatSpeaker](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) joins the channel.
	 */
	SpeakerJoined: RBXScriptSignal<(speakerName: string) => void>;

	/**
	 * Fires when a [ChatSpeaker](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) leaves the channel.
	 */
	SpeakerLeft: RBXScriptSignal<(speakerName: string) => void>;

	/**
	 * Fires when a [ChatSpeaker](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) has been muted in the channel.
	 */
	SpeakerMuted: RBXScriptSignal<(speakerName: string, reason: string, duration: number) => void>;

	/**
	 * Fires when a [ChatSpeaker](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) is unmuted.
	 */
	SpeakerUmuted: RBXScriptSignal<(speakerName: string) => void>;

	/**
	 * @deprecated
	 * Undocumented
	 */
	Destroyed: RBXScriptSignal<() => void>;
}

/**
 * A ChatMessage is a data structure representing a message sent from a [ChatSpeaker](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker). It contains data about the message, including the length of the text, whether the text has been filtered by Roblox, and extra data about the message’s appearance.
 */
export interface ChatMessage {
	/**
	 * A unique numerical identifier for the message.
	 */
	ID: number;

	/**
	 * The name of the [ChatSpeaker](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) who sent the message.
	 */
	FromSpeaker: string;

	/**
	 * The name of the [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel) from which the message originated.
	 */
	OriginalChannel: string;

	/**
	 * Describes whether the message is filtered by Roblox (if true, Message will be nil)
	 */
	IsFiltered: boolean;

	/**
	 * The length of the message. You can use this to generate a hashed-out string if the message was filtered.
	 */
	MessageLength: number;

	/**
	 * The text of the message. This property will be nil if IsFiltered is true.
	 */
	Message?: string;

	/**
	 * The type of the message. These types are described in the ChatConstants module:
	 * Possible values: "Message", "System", "MeCommand", "Welcome", "SetCore", "Whisper"
	 */
	MessageType: MessageType;

	/**
	 * A timestamp; the value of [os.time()](https://developer.roblox.com/en-us/articles/Lua-Libraries/os) at the time of the message’s creation.
	 */
	Time: number;

	/**
	 * A dictionary of metadata for this message. This is used to alter the appearance of the message. The following keys may be present:
	 * * Color3 `ChatColor`
	 * * string `NameColor`
	 * * Font `Font`
	 * * int `TextSize`
	 * * array<string> `Tags`
	 */
	ExtraData?: ExtraData;
}

/**
 * A ChatSpeaker is the representation of one entity that may speak in a [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel). Each [Player](https://developer.roblox.com/en-us/api-reference/class/Player) connected to the game automatically has an associated ChatSpeaker. Additional ChatSpeakers may be constructed for non-players (such as announcers or hint messages) using [ChatService:AddSpeaker()](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatService).
 */
export interface ChatSpeaker {
	//! PROPERTIES

	/**
	 * The name of the speaker, used in referencing this speaker while calling many other functions.
	 */
	Name: string;

	//! METHODS

	/**
	 * Adds the speaker to the channel with the given channelName
	 */
	JoinChannel(channelName: string): void;

	/**
	 * Removes the speaker from the channel with the given channelName
	 */
	LeaveChannel(channelName: string): void;

	/**
	 * Returns a list of the names of all the channels the speaker is in.
	 */
	GetChannelList(): Array<string>;

	/**
	 * Returns whether the speaker is in the channel with the given channelName.
	 */
	IsInChannel(channelName: string): boolean;

	/**
	 * Causes the speaker to say message and return the [ChatMessage](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatMessage) object created in doing so. If no such speaker is in the channel, this message returns nil.
	 */
	SayMessage(message: string, channelName: string, extraData?: ExtraData): ChatMessage;

	/**
	 * Sends a message to the [ChatSpeaker](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatSpeaker) with the given fromSpeaker name. If no such speaker is in the channel, this method creates a warning and the speaker will not see the message.
	 */
	SendMessage(message: string, channel: string, fromSpeaker: string, extraData?: ExtraData): void;

	/**
	 * Sends a system message to the [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel) with the given channelName. If the speaker is not in the channel, then this message will create a warning and other speakers in the channel will not see the message.
	 */
	SendSystemMessage(message: string, channelName: string, extraData?: ExtraData): void;

	/**
	 * Returns the [Player](https://developer.roblox.com/en-us/api-reference/class/Player) object associated with the speaker. If the speaker is not for a player (a bot) then this returns nil.
	 */
	GetPlayer(): Player | undefined;

	/**
	 * @deprecated
	 * Undocumented
	 */
	GetNameForDisplay(): string;

	/**
	 * Sets some extra data for the speaker under a specific key. Whenever the speaker sends a [ChatMessage](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatMessage) this extra data is attached to the message if none is explicitly provided with the message. For example, this allows the speaker’s chat color to be set.
	 */
	SetExtraData<T extends keyof ExtraDataFull>(key: T, value: ExtraDataFull[T]): void;

	/**
	 * Returns the extra data associated with the given key, set using SetExtraData.
	 */
	GetExtraData<T extends keyof ExtraDataFull>(key: T): ExtraDataFull[T];

	/**
	 * Sets the speaker to talk in the provided channel. Fires MainChannelSet.
	 */
	SetMainChannel(channelName: string): void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	AddMutedSpeaker(speakerName: string): void;

	/**
	 * @deprecated
	 * Undocumented
	 */
	RemoveMutedSpeaker(speakerName: string): void;

	//! EVENTS

	/**
	 * Fired when the speaker sends a [ChatMessage](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatMessage) from a [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel) to the [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel)
	 */
	SaidMessage: RBXScriptSignal<(message: ChatMessage, channelName: string) => void>;

	/**
	 * Fired when the speaker receives a [ChatMessage](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatMessage) from a [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel) from another speaker on a [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel)
	 */
	ReceivedMessage: RBXScriptSignal<(message: ChatMessage, channelName: string) => void>;

	/**
	 * Fired when the speaker receives a system [ChatMessage](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatMessage) from a [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel) with the given channelName.
	 */
	ReceivedSystemMessage: RBXScriptSignal<(message: ChatMessage, channelName: string) => void>;

	/**
	 * Fired when the speaker joins the [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel) with the given channelName.
	 */
	ChannelJoined: RBXScriptSignal<(channelName: string, channelWelcomeMessage: string) => void>;

	/**
	 * Fired when the speaker leaves a [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel) with the given channelName.
	 */
	ChannelLeft: RBXScriptSignal<(channelName: string) => void>;

	/**
	 * Fired when the speaker is muted on the [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel) with the given channelName for the given duration (if provided). There may or may not be a reason provided.
	 */
	Muted: RBXScriptSignal<(channelName: string, reason: string | undefined, duration: number) => void>;

	/**
	 * Fired when the speaker is unmuted on the [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel) with the given channelName.
	 */
	Unmuted: RBXScriptSignal<(channelName: string) => void>;

	/**
	 * Fired when the default value of a key in the speaker’s extra data is updated using SetExtraData.
	 */
	ExtraDataUpdated: RBXScriptSignal<(key: keyof ExtraDataFull, data: ExtraDataFull[keyof ExtraDataFull]) => void>;

	/**
	 * Fired when the speakers main channel is changed to the [ChatChannel](https://developer.roblox.com/en-us/articles/Lua-Chat-System/API/ChatChannel) with the given channelName.
	 */
	MainChannelSet: RBXScriptSignal<(channelName: string) => void>;
}

// roblox-ts complains if this isn't here
export default {};