import { ChatService } from './server';

/**
 * Get the Lua chat service singleton
 */
export function GetLuaChatService(): ChatService {
	return require(game.GetService('ServerScriptService').WaitForChild('ChatServiceRunner').WaitForChild('ChatService') as ModuleScript) as ChatService;
}

export * from './server';
