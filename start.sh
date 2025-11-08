#!/bin/bash

echo "Starting VNIT Guest House Booking System..."
echo ""
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Error installing dependencies"
    exit 1
fi

echo ""
echo "Installing client dependencies..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "Error installing client dependencies"
    exit 1
fi

cd ..

echo ""
echo "Starting servers..."
echo "Backend will run on http://localhost:5000"
echo "Frontend will run on http://localhost:3000"
echo ""
npm run dev

