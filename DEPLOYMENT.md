# MedScribe AI Deployment Guide

This guide covers deploying the MedScribe AI application to production using Vercel (frontend) and Render (backend), as specified in the project requirements.

## Prerequisites

Before deploying, ensure you have:

1. **Google AI Studio API Key**: Obtain from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **GitHub Repository**: Push your code to a GitHub repo
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
4. **Render Account**: Sign up at [render.com](https://render.com)

## Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. Ensure your `backend/.env` file contains:
   ```
   GEMINI_API_KEY=your_google_ai_studio_api_key_here
   PORT=10000  # Render assigns dynamic ports
   MODEL_NAME=models/gemini-2.5-flash  # or your chosen model
   ```

2. Update `backend/package.json` to include a start script:
   ```json
   "scripts": {
     "start": "node index.js"
   }
   ```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: medscribe-ai-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `GEMINI_API_KEY`: Your Google AI Studio API key
   - `MODEL_NAME`: Your chosen model name (e.g., `models/gemini-2.5-flash`)
   - `PORT`: Leave as default (Render sets this)
6. Click "Create Web Service"

Your backend will be available at `https://your-service-name.onrender.com`

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. Update `frontend/vite.config.js` to handle production builds:
   ```js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: 'dist'
     }
   })
   ```

2. Ensure `frontend/.env` contains:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
5. Add environment variables:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://medscribe-ai-backend.onrender.com`)
6. Click "Deploy"

Your frontend will be available at `https://your-project-name.vercel.app`

## Environment Variables Summary

### Backend (.env)
```
GEMINI_API_KEY=your_api_key_here
MODEL_NAME=models/gemini-2.5-flash
PORT=10000
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.onrender.com
```

## Testing Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-backend.onrender.com/
   ```
   Should return: `{"message":"MedScribe AI Backend is running"}`

2. **Models List**:
   ```bash
   curl https://your-backend.onrender.com/models
   ```
   Should return available Gemini models

3. **Frontend**: Open `https://your-frontend.vercel.app` in browser
   - Should load the MedScribe AI interface
   - Try generating a SOAP note or uploading a prescription image

## Troubleshooting

### Backend Issues
- **Port Error**: Render assigns dynamic ports; ensure `PORT` is not hardcoded
- **Model Not Found**: Check `MODEL_NAME` matches available models from `/models` endpoint
- **API Key**: Verify your Google AI Studio API key is valid and has quota

### Frontend Issues
- **API Calls Fail**: Ensure `VITE_API_URL` points to correct Render backend URL
- **CORS Errors**: Backend has CORS enabled; check if requests include proper headers
- **Build Fails**: Ensure all dependencies are in `package.json`

### Common Errors
- **403 Permission Denied**: Check GitHub repository permissions
- **Build Timeouts**: Reduce bundle size or increase timeout limits
- **Environment Variables**: Ensure variables are set in deployment platform settings

## Security Notes

- Never commit `.env` files to Git
- Use environment variables for all secrets
- Consider rate limiting API calls in production
- Monitor usage and costs in Google AI Studio

## Cost Considerations

- **Render**: Free tier available, paid plans for higher usage
- **Vercel**: Generous free tier, paid for custom domains/commercial use
- **Google AI Studio**: Pay-per-use pricing based on tokens

## Next Steps

After deployment:
1. Set up monitoring (Render/Vercel dashboards)
2. Configure custom domains if needed
3. Add error tracking (e.g., Sentry)
4. Implement user authentication if required
5. Add analytics to track usage

For production optimizations, consider:
- CDN for static assets
- Database for user sessions (if adding auth)
- Caching layers for API responses
- Load balancing for high traffic