# FuHoo_Outbreak_App
This is an app for administering the Future Hooman version: Outbreak at the Clinic

## About Future Hooman: Outbreak at the Clinic

Future Hooman: Outbreak at the Clinic is a social deduction game set in an interdimensional healthcare clinic operated by PHAX. A crisis has emerged: deliberate sabotage involving iFlu. Staff must identify and quarantine the saboteurs (SigSev) before everyone is neutralized. Clinicians win by quarantining the Inoculator, while SigSev wins by neutralizing enough Clinicians.

This is a narrative reskin of Blood on the Clocktower, preserving all core mechanics while reframing the experience through corporate uncanny fiction.

## Features

- **Landing Page**: Easy navigation to create or join sessions, plus operational protocols
- **Helper Bot 3000 Dashboard**: Complete session management interface with:
  - Staff management and tracking
  - Role assignment system (20+ roles)
  - Power Cycle (Stasis) / Active Cycle controls
  - Role distribution calculator
  - Activity log for tracking events
- **Staff View**: Individual staff interface showing:
  - Secret role assignment with faction and abilities
  - Live staff roster
  - Activity updates
- **20+ Character Roles** including:
  - Clinicians (Internal Investigator, Mind Melder, Virologist, etc.)
  - FHEELS (Intern, Corporate Simp, Sympathizer, FHEELS Executive)
  - SigSev Operatives (Signal Jacker, Embedded Observer, Lieutenant, Propagandist)
  - Inoculator (Patient Zero)

## How to Play

1. **Helper Bot 3000 Operator**: Click "Create Game (Helper Bot 3000)" and share the session code with staff
2. **Staff Members**: Click "Join Game (Clinician)" and enter the session code
3. **Helper Bot 3000 Operator**: Assign roles to staff once everyone has joined
4. **Gameplay**: Alternate between stasis and active cycles
   - **Power Cycle (Stasis)**: Staff with stasis abilities perform their actions
   - **Active Cycle**: Staff discuss, nominate, and vote on quarantine

## Narrative Elements

- **PHAX**: The interdimensional healthcare corporation that operates the clinic
- **iFlu**: The crisis at the center of the outbreak (administered by the Inoculator)
- **SigSev (Signal Severed)**: Ideological saboteurs who believe PHAX enforces dependence
- **Clinicians**: PHAX staff and aligned operators working to stop the outbreak
- **Helper Bot 3000**: The authoritative interface (replaces Storyteller)
- **Corporate Simp**: A FHEELS representative who over-identifies with PHAX (replaces Drunk)
- **Signal Jacked**: Active hostile interference by SigSev (replaces Poisoned)

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
- Persistent session state storage
- Additional role sets and scenarios
- Timer functionality for phases
- Vote tracking and resolution system
- Stasis action order automation
- Enhanced Helper Bot 3000 voice and personality

## Game Mechanics Note

**All game mechanics remain identical to Blood on the Clocktower.** This is a narrative reskin only - no rules, timing, information access, win conditions, or balance have been changed. BotC veterans can play without confusion.

## Security

The application includes HTML escaping to prevent XSS attacks and follows modern web security best practices.
