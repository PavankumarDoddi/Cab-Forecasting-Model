#!/bin/bash

cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 &
cd ..

cd frontend
npm install
npm start
