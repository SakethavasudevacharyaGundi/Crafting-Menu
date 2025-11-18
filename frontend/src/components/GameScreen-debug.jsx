import React from 'react'

export default function GameScreen(){
  return (
    <div className="w-full h-screen flex items-center justify-center text-gray-200">
      <div className="text-center">
        <h1 className="text-4xl mb-4">Game Loading...</h1>
        <p>If you see this, React is working!</p>
        <div className="mt-4">
          <img 
            src="/assets/image1.png" 
            alt="test"
            className="max-w-md rounded"
            onLoad={() => console.log('Image loaded successfully')}
            onError={(e) => console.log('Image failed to load:', e)}
          />
        </div>
      </div>
    </div>
  )
}