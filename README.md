# Chess Multiplayer Test

This repository is an experimental setup for a multiplayer chess project with custom boards and pieces.  

## Purpose
- Test hosting architecture: GitHub → Vercel (frontend) + Glitch (backend)
- Demonstrate secure secret sharing from backend to frontend ("Cheese Package")
- Prototype dynamic communication for future multiplayer chess features

## Structure
- **Frontend (Vercel)**: HTML/JS/CSS
- **Backend (Glitch)**: Node.js + Express (or socket.io later)
- **Secret**: Stored only in backend, fetched dynamically by frontend

## Next Steps
1. Set up GitHub repository and push starter code.
2. Deploy frontend to Vercel.
3. Deploy backend to Glitch with secret.
4. Test “Cheese Package” functionality.
