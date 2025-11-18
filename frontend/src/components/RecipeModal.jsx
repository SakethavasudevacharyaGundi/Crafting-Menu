import React from 'react'
import { apiGet } from '../api'

export default function RecipeModal({ itemId, onClose }){
  const [closure, setClosure] = React.useState(null)
  React.useEffect(()=>{
    if (!itemId) return
    apiGet(`/api/recipe_closure/${itemId}`).then(setClosure).catch(()=>setClosure(null))
  }, [itemId])

  if (!itemId) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-slate-900 p-4 rounded w-2/3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg">Recipe</h3>
          <button onClick={onClose} className="px-2 py-1 bg-slate-700 rounded">Close</button>
        </div>
        <div className="max-h-96 overflow-auto">
          {closure ? (
            <pre className="text-sm">{JSON.stringify(closure, null, 2)}</pre>
          ) : <div className="text-slate-400">Recipe not available on backend</div>}
        </div>
      </div>
    </div>
  )
}
