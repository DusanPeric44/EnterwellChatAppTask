# Enterwell Chat App

## 1. Project Overview

Enterwell Chat App is a production-style React Native mobile application that demonstrates a modern, layered architecture for a chat experience.

The application focuses on:

- A **single chat conversation** screen with:
  - Text and image messages
  - Message reactions
  - Replying to previous messages
  - Emoji picker
  - Scroll-to-bottom behavior
- A **home screen** showing mock chat previews that navigates into the chat screen.
- A **clean architectural separation** between domain, data, and presentation layers, with testable use cases and repositories.

### What problem it solves

The project is a reference implementation for:

- Structuring a React Native app with **clear separation of concerns**.
- Demonstrating how to implement:
  - Domain use cases
  - Repository abstractions
  - ViewModel-style hooks
  - Theming and UI composition
- Providing a realistic, production-like chat UI while keeping the backend mocked/simulated.

### Core features implemented (based strictly on code)

- **Home screen**
  - Lists mock conversations with avatar, name, last message, and unread badge.
  - Tap a conversation to open the chat screen.

- **Chat screen**
  - Displays a list of messages (text and images).
  - Supports message **replies** (`replyTo` logic).
  - Supports **reactions** via a long-press reaction bar.
  - Allows copying message text/URL to clipboard.
  - Integrated **emoji picker** for composing messages.
  - Scroll-to-bottom button when new messages arrive above the viewport.
  - Keyboard-aware layout behavior for input.

- **Message simulation**
  - Uses a **local repository** backed by a JSON file (`localMessages.json`) to simulate incoming messages over time.

- **Theming**
  - Light/dark theme support using the system color scheme.
  - Centralized theme tokens for chat, messages, and global surfaces.

- **Architecture and testability**
  - Clean separation: `domain` / `data` / `presentation`.
  - Repository pattern with a domain-level `ChatRepository` interface.
  - Domain use cases for `getMessages`, `sendMessage`, and `addReaction`.
  - ViewModel-style hook (`useChatViewModel`) for state orchestration.
  - Unit tests for use cases and ViewModel using a fake repository.

---

## 2. Setup & Running the Project

### Prerequisites

- **Node.js**: **24.7.0** (recommended and tested).
- **Watchman**: Recommended for macOS file watching.
- **React Native toolchain**:
  - macOS
  - Xcode + iOS simulator (for iOS)
  - Android Studio + Android SDK/emulator (for Android)
- A configured environment for React Native 0.83.1 (Hermes, Cocoapods, etc.)

### Install dependencies

```bash
npm install
```

### Set up environment

Duplicate the environment file:

```bash
cp .env.example .env
```
Change the values in `.env` as needed for your environment.

> On first iOS setup, you should also install pods:

```bash
npm run pod
```

(Internally runs `pod install`)

### Run on iOS

Start Metro in one terminal:

```bash
npm start
```

In another terminal:

```bash
npm run ios
```

Build and launch the app on the iOS simulator.

### Run on Android

Start Metro in one terminal:

```bash
npm start
```

In another terminal (with a device or emulator running):

```bash
npm run android
```

Build and launch the app.

### Run tests

```bash
npm test
```

This runs Jest test suites for use cases and the ViewModel.

### Run lint

```bash
npm run lint
```

This runs ESLint across the project.

---

## 3. Architecture

### Layered structure

The project is structured into three primary layers under `src/`:

- **Domain layer** – `src/domain`
  - **Models**: `Message` and related types  
    - [`src/domain/models/Message.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/domain/models/Message.ts)
  - **Enums**: `ReactionType`  
    - [`src/domain/enums/ReactionType.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/domain/enums/ReactionType.ts)
  - **Errors**: domain-level `ChatError` union  
    - [`src/domain/errors/ChatError.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/domain/errors/ChatError.ts)
  - **Use cases**:
    - `getMessages` – orchestrates initial load + subscription  
      [`src/domain/useCases/getMessages.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/domain/useCases/getMessages.ts)
    - `sendMessage` – constructs and sends a message  
      [`src/domain/useCases/sendMessage.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/domain/useCases/sendMessage.ts)
    - `addReaction` – encapsulates reaction update logic  
      [`src/domain/useCases/addReaction.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/domain/useCases/addReaction.ts)
  - **Repository interface**:
    - `ChatRepository` interface (domain contract)  
      [`src/domain/repositories/ChatRepository.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/domain/repositories/ChatRepository.ts)

- **Data layer** – `src/data`
  - **API client**:
    - `ApiClient` wrapper around axios and WebSocket  
      [`src/data/api/apiClient.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/data/api/apiClient.ts)
    - API endpoints  
      [`src/data/api/endpoints.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/data/api/endpoints.ts)
  - **Technical errors**:
    - `ApiError` class for HTTP/transport errors  
      [`src/data/errors/ApiError.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/data/errors/ApiError.ts)
  - **Repositories** (implement `ChatRepository`):
    - `LocalChatRepository`: in-memory/local messages with simulated incoming messages  
      [`src/data/repositories/LocalChatRepository.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/data/repositories/LocalChatRepository.ts)
    - `MockChatRepository`: fake repository used for tests  
      [`src/data/repositories/MockChatRepository.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/data/repositories/MockChatRepository.ts)
    - `RemoteChatRepository`: adapter for real HTTP/WebSocket API (not wired into UI yet)  
      [`src/data/repositories/RemoteChatRepository.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/data/repositories/RemoteChatRepository.ts)
  - **Local source**:
    - `localMessages.json` – mock dataset for initial/simulated messages  
      [`src/data/sources/localMessages.json`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/data/sources/localMessages.json)

- **Presentation layer** – `src/presentation`
  - **ViewModel**:
    - `useChatViewModel` – hook implementing the ViewModel pattern  
      [`src/presentation/viewmodels/useChatViewModel.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/presentation/viewmodels/useChatViewModel.ts)
  - **Screens**:
    - Home screen:  
      [`src/presentation/screens/HomeScreen.tsx`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/presentation/screens/HomeScreen.tsx)
    - Chat screen:  
      [`src/presentation/screens/ChatScreen.tsx`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/presentation/screens/ChatScreen.tsx)
  - **Components**:
    - `MessageItem`, `ReactionBar`, `ReplyPreview`  
      [`src/presentation/components`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/presentation/components)
  - **Theme**:
    - `lightTheme`, `darkTheme`, and `ThemeProvider`  
      [`src/presentation/theme/colors.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/presentation/theme/colors.ts)  
      [`src/presentation/theme/ThemeContext.tsx`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/presentation/theme/ThemeContext.tsx)
  - **Navigation**:
    - A simple stack between Home and Chat screens  
      [`src/navigation/RootStack.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/navigation/RootStack.ts)

### Repository pattern usage

- The **domain** defines `ChatRepository` as a pure interface, independent of technical details.
- The **data** layer provides concrete implementations:
  - `LocalChatRepository` – used in production UI, simulating server behavior using local JSON and timers.
  - `MockChatRepository` – used in tests; stateful, observable via `subscribeToMessages`.
  - `RemoteChatRepository` – prepared to call HTTP endpoints and WebSocket via `ApiClient`, mapping `ApiError` to `ChatError`.
- The **presentation** layer receives a `ChatRepository` instance and never calls network APIs directly.

### Use case pattern

Each domain use case:

- Receives a `ChatRepository`.
- Encapsulates a unit of business logic:
  - `getMessages(repository)`:
    - Loads initial messages.
    - Subscribes to new messages and returns an `unsubscribe` callback.
    - Normalizes errors to `ChatError`.
  - `sendMessage(repository)`:
    - Builds a full `Message` object from a lean input (including `replyTo`).
    - Invokes `repository.sendMessage`.
  - `addReaction(repository)`:
    - Updates or sets reaction on a `Message`.
    - Persists via `repository.updateMessage`.

No use case knows about React, UI components, or HTTP/WebSocket.

### ViewModel responsibility

`useChatViewModel`:

- Accepts a `ChatRepository`.
- Owns **screen-level state**:
  - `messages: Message[]`
  - `loading: boolean`
  - `error: ChatError | null`
- Orchestrates:
  - Initial load and subscription via `getMessages`.
  - Sending messages via `sendMessage`.
  - Updating reactions via `addReaction`.
- Buffers incoming messages until initial load completes to avoid flicker.
- Handles lifecycle:
  - Registers subscription on mount, unsubscribes on unmount.
  - Prevents state updates after unmount using an `isCancelled` flag.

### Why this architecture

- **Scalability**: Clear boundaries make it easy to add new use cases and repository implementations (e.g. real remote API) without touching UI.
- **Testability**:
  - Domain and ViewModel are tested with a `MockChatRepository`.
  - UI is mostly passive, rendering based on ViewModel state.
- **Separation of concerns**:
  - Domain models business logic.
  - Data isolates infrastructure concerns (HTTP, WebSocket, JSON).
  - Presentation handles UX, layout, and theming.
- **Dependency inversion**:
  - Domain defines `ChatRepository`; data implements it.
  - ViewModel depends on the domain interface, not the concrete repository.
  - Screen composition chooses which repository implementation to use.

---

## 4. Data Flow Explanation

### Message flow: UI → ViewModel → Use Case → Repository → Source

For the **current runtime configuration**, the Chat screen uses `LocalChatRepository`:

1. **UI (ChatScreen)**
   - Renders `ChatScreen` and constructs a `LocalChatRepository`.
   - Calls `useChatViewModel(repository)`.

2. **ViewModel (`useChatViewModel`)**
   - On mount:
     - Calls `getMessages(repository)(onNewMessage)`:
       - `onNewMessage` is a callback that appends new messages into state (with duplicate ID protection).
     - Receives `{ initialMessages, unsubscribe }`.
     - Merges `initialMessages` with any buffered messages and sets `messages`.
   - On send:
     - `sendMessage(text, replyToId)` calls `sendMessage(repository)` use case with `{ text, replyTo }`.
   - On reaction:
     - `onReact(id, reaction)` calls `addReaction(repository)(message, reaction)`.

3. **Use cases**
   - `getMessages`:
     - Calls `repository.getInitialMessages()`.
     - Calls `repository.subscribeToMessages(onNewMessage)` and returns the unsubscribe function.
   - `sendMessage`:
     - Constructs `Message` (new ID, `from`, `type`, `url`, `replyTo`).
     - Calls `repository.sendMessage(message)`.
   - `addReaction`:
     - Mutates `message.reactions` (increment or replace).
     - Calls `repository.updateMessage(message)`.

4. **Repository**
   - **LocalChatRepository** (used by UI):
     - Uses an in-memory array for `messages`.
     - `getInitialMessages` returns the in-memory list.
     - `sendMessage` pushes the message into the list.
     - `subscribeToMessages`:
       - Schedules periodic messages from `localMessages.json` via `setTimeout`.
       - Calls the `onMessage` callback each time.
   - **RemoteChatRepository** (available, not wired into UI):
     - Would call HTTP endpoints via `apiClient.get/post/put`.
     - Would connect to WebSocket with `apiClient.connect`.
     - Maps `ApiError` to `ChatError`.

5. **Source**
   - For the local repository, the “source” is:
     - In-memory `messages` array.
     - Seeded/extended from `localMessages.json`.

### Subscription handling

- `getMessages` returns an `unsubscribe` function from the repository.
- `useChatViewModel` stores this and:
  - Calls it during cleanup (on unmount).
  - Stops updating state when `isCancelled` is set, preventing leaks.

In `LocalChatRepository`:

- `subscribeToMessages`:
  - Schedules the next message with `setTimeout`.
  - On each tick:
    - Grabs the next entry from `localMessages.json`.
    - Appends it to the internal `messages` array.
    - Fires `onMessage(message)`.
  - Returns a function that clears the timeout, stopping the simulation.

### Reply handling (`replyTo` logic)

- Each `Message` has `replyTo: number | null`.
- When sending a reply:
  - `ChatScreen` passes `replyingTo?.id` into `sendMessage`.
  - The `sendMessage` use case stores `replyTo` in the constructed `Message`.
- UI rendering:
  - `MessageItem` receives both:
    - `item` (the message).
    - `replyMessage`, looked up from `messages` via `replyTo`.
  - If `replyMessage` exists:
    - Renders a “reply context” block at the top of the bubble:
      - Shows “You” or group name, and a one-line preview of the original text or “[Photo]”.
  - Tapping the reply area scrolls to the referenced message using `scrollToIndex`.

---

## 5. Error Handling Strategy

### Across layers

- **Data (technical errors)**
  - `ApiClient` intercepts HTTP errors and wraps them into an `ApiError` with:
    - `status` (HTTP status code, if available).
    - `message` (from axios error or a fallback).
  - `RemoteChatRepository` catches `ApiError` and maps it into `ChatError`:
    - `network` (no status).
    - `unauthorized` (401).
    - `not_found` (404).
    - `unknown` (other statuses, with optional message).
  - For non-`ApiError` errors, it returns `ChatError` with `type: "unknown"` and optional message.

- **Domain**
  - `getMessages` wraps any repository-thrown error into a `ChatError` using `toChatError`.
  - This ensures the ViewModel always sees a `ChatError`, not a raw technical error.

- **ViewModel**
  - `useChatViewModel`:
    - Sets `error: ChatError | null`.
    - In `init()`, if `getMessages` throws, catches the error, stores it in `error`, and sets `loading` to `false`.
    - Resets `error` to `null` when re-running `init` or on unmount.

- **UI**
  - `ChatScreen` renders errors using `getErrorMessage(error: ChatError)`, which:
    - Maps `network` to a “network error” message.
    - Maps `unauthorized` to an authorization message.
    - Maps `not_found` to a “chat not found” message.
    - For `unknown` with `message`, surfaces the message; otherwise shows a generic fallback.
  - The error is displayed above the `FlatList` in the content area.

### Important nuance

- In the current runtime configuration, the chat screen uses `LocalChatRepository`, which **does not** throw `ChatError` in normal operation. Most error pathways will be relevant once `RemoteChatRepository` is wired in.
- Still, the infrastructure and domain are ready for robust error mapping, and the ViewModel and UI already handle `ChatError` correctly.

---

## 6. State Management Approach

### How state is managed

- **React hooks**:
  - The app uses React function components with `useState`, `useEffect`, `useMemo`, and `useCallback`.
- **ViewModel hook (`useChatViewModel`)**:
  - Centralizes chat-related state and logic:
    - `messages`, `loading`, `error`.
    - `sendMessage(text, replyTo?)`.
    - `onReact(messageId, reaction)`.
  - Exposes a minimal API to the UI, making the screen a simple consumer of ViewModel state.

- **Screen-level UI state**:
  - `ChatScreen` manages only presentation concerns:
    - Input text.
    - Selected message ID.
    - Currently replied-to message.
    - Emoji picker visibility.
    - Scroll-to-bottom control visibility.
    - Keyboard visibility.

### Why no global state library

- The current application scope is **single-conversation oriented**, with:
  - A simple Home screen that only passes nav params.
  - A Chat screen that owns its own state.
- All state is **screen-local**:
  - There is no shared global state that would require Redux, Zustand, or similar.
- Using React hooks + a ViewModel hook provides:
  - Sufficient structure and testability.
  - Lower complexity and boilerplate than introducing a full state management library.

If the app grows to multiple chats with persistent user sessions and cross-screen shared state, adding a global state solution would then be considered.

---

## 7. Performance Considerations

### FlatList usage

- `ChatScreen` uses `FlatList` for messages:
  - `data={messages}`
  - `keyExtractor` by `message.id.toString()`
  - `maintainVisibleContentPosition` configured to keep scroll behavior stable on new messages.
  - `scrollEventThrottle={16}` for smooth scroll updates.

### Memoization / optimizations

- **MessageItem**:
  - Wrapped in `React.memo` to avoid unnecessary re-renders when props do not change.
- **Reply lookup**:
  - `messageById` is computed via `useMemo` as a `Map<id, Message>`:
    - Used to look up `replyMessage` for each item.
    - Complexity: O(1) per lookup, avoiding O(n²) scanning per render.
- **Callbacks**:
  - Key callbacks such as `scrollToIndex` and `handleLongPress` use `useCallback` to provide stable references and avoid unnecessary re-renders in children.

### What is *not* done

- No aggressive windowing beyond `FlatList` defaults.
- No manual virtualization or message grouping.
- No premature optimizations in areas where the complexity is already linear and acceptable for typical chat workloads.

The current performance profile is appropriate for the feature set and dataset size implemented.

---

## 8. Theming

### How theming is structured

- **Theme definitions**:
  - `lightTheme` and `darkTheme` objects with:
    - Core colors (`primary`, `background`, text, border, error).
    - Nested `chat` colors (chat background, header, input container, send button, reply visuals).
    - Nested `message` colors (incoming/outgoing bubbles, text, metadata).
  - Defined in  
    [`src/presentation/theme/colors.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/presentation/theme/colors.ts).

- **Theme context/provider**:
  - `ThemeProvider` uses `useColorScheme()` to choose between `lightTheme` and `darkTheme`.
  - `useTheme` hook exposes `{ theme, isDark }`.
  - Implemented in  
    [`src/presentation/theme/ThemeContext.tsx`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/src/presentation/theme/ThemeContext.tsx).

- **Consumption**
  - Screens and components call `useTheme()` and derive their styles via a `createStyles(theme)` helper.
  - Styles are computed with `useMemo` to avoid recalculation on each render when theme doesn’t change.

### Why theme is in the presentation layer

- The theme describes **visual concerns** only:
  - Colors, shadows, paddings, etc.
- Keeping it in the presentation layer:
  - Avoids coupling domain/data logic to UI design.
  - Makes it easy to replace or extend themes without touching business logic.
  - Ensures domain remains portable to other environments (e.g. web, server) if needed.

---

## 9. Testing

### What is tested

- **Domain use cases**
  - `addReaction`:
    - Adding a new reaction when none exists.
    - Incrementing reaction count.
    - Replacing an existing reaction with a new one.
    - Verifying changes persist via repository.  
      [`__tests__/addReaction.test.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/__tests__/addReaction.test.ts)
  - `getMessages`:
    - Verifies that messages received via `subscribeToMessages` reach the consumer callback.  
      [`__tests__/getMessages.test.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/__tests__/getMessages.test.ts)

- **Repository behavior (Mock)**
  - `sendMessage` behavior is tested directly via `MockChatRepository`, ensuring messages are stored in memory.  
    [`__tests__/sendMessage.test.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/__tests__/sendMessage.test.ts)

- **ViewModel (`useChatViewModel`)**
  - Initial messages loading.
  - Sending messages updates ViewModel state and underlying repo messages.
  - Adding reactions updates both ViewModel state and repository.
  - Receiving new messages from repo via subscription updates state.  
    [`__tests__/useChatViewModel.test.ts`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/__tests__/useChatViewModel.test.ts)

### Why UI is not deeply tested

- The **UI layer** (screens/components) is primarily a thin wrapper around the ViewModel:
  - It renders based on ViewModel state and forwards user events to ViewModel callbacks.
- The tests focus on:
  - Domain logic.
  - State transitions inside the ViewModel.
  - Repository behavior using a fake.
- This keeps tests:
  - Fast and stable.
  - Less sensitive to layout changes or style tweaks.

If the UI grows in complexity, additional tests using `@testing-library/react-native` could be added to cover critical interactions.

### Use of Mock/Fake repository

- `MockChatRepository` (in `src/data/repositories/MockChatRepository.ts`) is a **first-class fake**:
  - In-memory list of messages.
  - Subscription API with subscriber set and `emitMessage` helper.
  - This repository is used in unit tests instead of mocking domain behavior, which keeps tests realistic and close to production semantics.

---

## 10. Tech Stack

### Core

- **React Native**: `0.83.1`  
  (from `package.json`)
- **React**: `19.2.0`
- **TypeScript**: configured via  
  [`tsconfig.json`](file:///Users/page/Desktop/enterwell-task/EnterwellChatApp/tsconfig.json) and `@react-native/typescript-config`.
- **Node.js**: **24.7.0**  
  The project is used with Node.js 24.7.0. The `package.json` declares `engines.node >= 20`, and this setup has been validated with Node 24.7.0.
- **Testing**:
  - **Jest**: `^29.6.3`
  - **@testing-library/react-native**: `^13.3.3`
- **Linting/Formatting**:
  - ESLint: `^8.19.0` (script: `npm run lint`)
  - Prettier: `2.8.8`

### UI and utilities

- **React Native Paper**: `^5.15.0` – UI components (Text, Surface, IconButton, etc.).
- **React Navigation**:
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
- **react-native-safe-area-context** – safe area handling.
- **react-native-emoji-picker** (`@hiraku-ai/react-native-emoji-picker`) – emoji picker component.
- **react-native-vector-icons** – icon fonts.
- **@react-native-clipboard/clipboard** – clipboard integration.
- **axios**: HTTP client (wrapped by `ApiClient`).
- **react-native-dotenv**: environment variables (`API_URL`, `WS_URL`).

---

## 11. Design Decisions

### Why this architecture

- **Layered separation**:
  - Keeps domain logic free from UI and infrastructure concerns.
  - Makes testing easier and more focused.
- **Testability**:
  - Use cases are simple functions that accept a `ChatRepository`.
  - ViewModel is a pure hook with injected dependencies, making it easy to test.
- **Flexibility**:
  - Adding a real backend is mostly a matter of wiring in `RemoteChatRepository` and providing real endpoints.

### Why no Redux / external state manager

- Scope:
  - The app has a limited number of screens and no cross-screen global state beyond navigation.
- Localized state:
  - Chat-specific state is fully encapsulated in the ViewModel hook and the Chat screen.
- Overhead:
  - Introducing Redux or similar would add considerable boilerplate without clear benefit at this scale.

### Why repository abstraction is used

- Allows multiple implementations:
  - `LocalChatRepository` for simulated local/demo data.
  - `MockChatRepository` for testing.
  - `RemoteChatRepository` for real API integration.
- Shields domain use cases and ViewModel from:
  - HTTP details.
  - WebSocket lifecycle.
  - Data source specifics (local JSON vs. remote DB).
- Follows clean architecture principles:
  - Domain owns the abstraction (`ChatRepository`).
  - Data layer implements it.

### Why a fake repository exists for tests

- `MockChatRepository` behaves like a real repository:
  - Stores messages in memory.
  - Supports `getInitialMessages`, `sendMessage`, `updateMessage`, and `subscribeToMessages`.
- Benefits:
  - Tests run fast and deterministically.
  - No network or environment dependencies.
  - Tests exercise real domain and ViewModel logic, not mocked functions.

---

## 12. Future Improvements

These are realistic future enhancements aligned with the current structure:

1. **Wire RemoteChatRepository into the UI**
   - Replace `LocalChatRepository` in `ChatScreen` with `RemoteChatRepository` behind a configuration or environment flag.
   - Use `API_URL` and `WS_URL` from `.env` to connect to a real backend.

2. **Enhance error messaging**
   - Map more HTTP status codes to specific user-facing `ChatError` variants.
   - Add localized messages or toast notifications for transient errors (e.g. `network`).

3. **Extend sendMessage behavior**
   - Integrate acknowledgement or delivery status when using the remote repository (e.g. pending/sent/failed states).
   - Handle retries for transient network failures.

4. **Add more domain-level use cases**
   - Deleting messages.
   - Editing messages.
   - Managing reactions from multiple users (e.g. multiple reaction types per message).

5. **Increase test coverage**
   - Add unit tests:
     - For the `sendMessage` use case.
     - For `RemoteChatRepository.mapError`.
     - For error handling in `useChatViewModel` when repositories throw `ChatError`.
   - Add a small number of UI tests for critical flows (e.g. “send message” and “add reaction” from the user’s perspective).

6. **Persistence for local repository**
   - Back `LocalChatRepository` with AsyncStorage to retain messages across app restarts, which is already compatible with the existing repository interface.

These improvements can all be made without changing the core architecture, thanks to the current separation of domain, data, and presentation.

---