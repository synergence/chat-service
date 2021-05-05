import { ClientChatMain } from './client';
import { ChatService } from './server';

const Players = game.GetService('Players');

/**
 * Get the Lua chat service singleton
 */
export function GetLuaChatService(): ChatService {
	return require(game.GetService('ServerScriptService').WaitForChild('ChatServiceRunner').WaitForChild('ChatService') as ModuleScript) as ChatService;
}

/**
 * Get the client Lua chat service singleton
 *
 * NOTE: There was no documentation available for ChatMain on the Developer Hub, so ChatMain has no docstrings.
 */
 export function GetClientLuaChatService(): ClientChatMain {
	return require(Players.LocalPlayer.WaitForChild('PlayerScripts').WaitForChild('ChatScript').WaitForChild('ChatMain') as ModuleScript) as ClientChatMain;
}

export * from './client';
export * from './server';
