# @rbxts/chat-service

To use this, simply install `@rbxts/chat-service` with your favorite package manager. To get started:
```ts
import { GetLuaChatService } from '@rbxts/chat-service';

const LuaChatService = GetLuaChatService();
```

For more advanced users, you can also import the type and manually retrieve the Chat Service:
```ts
import type { ChatService } from '@rbxts/chat-service';

const LuaChatService = require(game.GetService('ServerScriptService').WaitForChild('ChatServiceRunner').WaitForChild('ChatService') as ModuleScript) as ChatService;
```

This project is licensed under [The Unlicense](https://unlicense.org).