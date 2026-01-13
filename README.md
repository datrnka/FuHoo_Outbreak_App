# FuHoo_Outbreak_App
This is an app for administering the FuHoo version of Blood on the Clocktower

## About Blood on the Clocktower

Blood on the Clocktower is a social deduction game where good fights evil. Players are secretly assigned roles and must work together (or against each other) to achieve their team's victory condition. The good team wins by executing the Demon, while the evil team wins by eliminating enough good players.

## Features

- **Landing Page**: Easy navigation to create or join games, plus game rules
- **Storyteller Dashboard**: Complete game management interface with:
  - Player management and tracking
  - Role assignment system (20+ roles from Trouble Brewing edition)
  - Night/Day phase controls
  - Role distribution calculator
  - Game log for tracking events
- **Player View**: Individual player interface showing:
  - Secret role assignment with team and abilities
  - Live player list
  - Game events and updates
- **20+ Character Roles** including:
  - Townsfolk (Investigator, Empath, Fortune Teller, etc.)
  - Outsiders (Butler, Drunk, Recluse, Saint)
  - Minions (Poisoner, Spy, Scarlet Woman, Baron)
  - Demons (Imp)

## How to Play

1. **Storyteller**: Click "Create Game (Storyteller)" and share the game code with players
2. **Players**: Click "Join Game (Player)" and enter the game code
3. **Storyteller**: Assign roles to players once everyone has joined
4. **Gameplay**: Alternate between night and day phases
   - **Night**: Players with night abilities perform their actions
   - **Day**: Players discuss, nominate, and vote on executions

## Technical Details

- Pure vanilla JavaScript, HTML5, and CSS3
- No external dependencies or frameworks
- Responsive design works on desktop and mobile
- Client-side only (no backend required for basic functionality)

## Running the App

Simply open `index.html` in a web browser, or serve it with any web server:

```bash
python3 -m http.server 8000
```

Then navigate to `http://localhost:8000`

## Future Enhancements

This is currently a client-side demonstration. For full multiplayer functionality, the following could be added:

- Backend server for real-time multiplayer synchronization
- WebSocket connections for live updates
- Persistent game state storage
- Additional character scripts (Sects & Violets, Bad Moon Rising)
- Timer functionality for phases
- Vote tracking and resolution system
- Night order automation

## Security

The application includes HTML escaping to prevent XSS attacks and follows modern web security best practices.
