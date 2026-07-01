import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Copy, Plus, RotateCcw, Trash2, Plane, Briefcase, CheckCircle2, Circle, X } from 'lucide-react'
import './styles.css'

type PackingItem = {
  id: string
  name: string
  packed: boolean
}

type PackingList = {
  id: string
  title: string
  emoji: string
  items: PackingItem[]
  createdAt: string
}

const STORAGE_KEY = 'packing-list-pro-v1'

const starterLists: PackingList[] = [
  {
    id: crypto.randomUUID(),
    title: 'Weekend Away',
    emoji: '🧳',
    createdAt: new Date().toISOString(),
    items: ['Toothbrush', 'Phone charger', 'Pajamas', 'Underwear', 'Socks', 'Extra shirt', 'Deodorant', 'Book or headphones'].map(name => ({
      id: crypto.randomUUID(),
      name,
      packed: false,
    })),
  },
  {
    id: crypto.randomUUID(),
    title: 'Beach Trip',
    emoji: '🏖️',
    createdAt: new Date().toISOString(),
    items: ['Swimsuit', 'Sunscreen', 'Sunglasses', 'Sandals', 'Beach towels', 'Hat', 'Reusable water bottle'].map(name => ({
      id: crypto.randomUUID(),
      name,
      packed: false,
    })),
  },
]

function loadLists(): PackingList[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return starterLists
    const parsed = JSON.parse(saved) as PackingList[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : starterLists
  } catch {
    return starterLists
  }
}

function App() {
  const [lists, setLists] = useState<PackingList[]>(loadLists)
  const [activeListId, setActiveListId] = useState(lists[0]?.id ?? '')
  const [newItem, setNewItem] = useState('')
  const [newListTitle, setNewListTitle] = useState('')
  const [showNewList, setShowNewList] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
  }, [lists])

  const activeList = useMemo(
    () => lists.find(list => list.id === activeListId) ?? lists[0],
    [lists, activeListId]
  )

  const packedCount = activeList?.items.filter(item => item.packed).length ?? 0
  const totalCount = activeList?.items.length ?? 0
  const progress = totalCount === 0 ? 0 : Math.round((packedCount / totalCount) * 100)

  function updateActiveList(updater: (list: PackingList) => PackingList) {
    if (!activeList) return
    setLists(current => current.map(list => (list.id === activeList.id ? updater(list) : list)))
  }

  function addItem() {
    const name = newItem.trim()
    if (!name) return
    updateActiveList(list => ({
      ...list,
      items: [...list.items, { id: crypto.randomUUID(), name, packed: false }],
    }))
    setNewItem('')
  }

  function toggleItem(itemId: string) {
    updateActiveList(list => ({
      ...list,
      items: list.items.map(item => item.id === itemId ? { ...item, packed: !item.packed } : item),
    }))
  }

  function deleteItem(itemId: string) {
    updateActiveList(list => ({
      ...list,
      items: list.items.filter(item => item.id !== itemId),
    }))
  }

  function resetList() {
    updateActiveList(list => ({
      ...list,
      items: list.items.map(item => ({ ...item, packed: false })),
    }))
  }

  function createList() {
    const title = newListTitle.trim()
    if (!title) return
    const newList: PackingList = {
      id: crypto.randomUUID(),
      title,
      emoji: '✈️',
      createdAt: new Date().toISOString(),
      items: [],
    }
    setLists(current => [newList, ...current])
    setActiveListId(newList.id)
    setNewListTitle('')
    setShowNewList(false)
  }

  function duplicateList() {
    if (!activeList) return
    const copy: PackingList = {
      ...activeList,
      id: crypto.randomUUID(),
      title: `${activeList.title} Copy`,
      createdAt: new Date().toISOString(),
      items: activeList.items.map(item => ({ ...item, id: crypto.randomUUID(), packed: false })),
    }
    setLists(current => [copy, ...current])
    setActiveListId(copy.id)
  }

  function deleteList() {
    if (!activeList || lists.length === 1) return
    const remaining = lists.filter(list => list.id !== activeList.id)
    setLists(remaining)
    setActiveListId(remaining[0].id)
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-topline">
          <span className="app-icon"><Briefcase size={22} /></span>
          <span>Packing List Pro</span>
        </div>
        <h1>Pack faster. Forget less.</h1>
        <p>Create trip lists, check items off, and keep everything saved on this device.</p>
      </section>

      <section className="list-switcher" aria-label="Packing lists">
        <button className="new-list-button" onClick={() => setShowNewList(true)}>
          <Plus size={18} /> New List
        </button>
        <div className="tabs">
          {lists.map(list => (
            <button
              key={list.id}
              className={`tab ${list.id === activeList?.id ? 'active' : ''}`}
              onClick={() => setActiveListId(list.id)}
            >
              <span>{list.emoji}</span> {list.title}
            </button>
          ))}
        </div>
      </section>

      {showNewList && (
        <section className="modal-card">
          <div className="modal-header">
            <strong>Create a new packing list</strong>
            <button className="icon-button" onClick={() => setShowNewList(false)} aria-label="Close"><X size={18} /></button>
          </div>
          <div className="add-row">
            <input
              autoFocus
              value={newListTitle}
              onChange={event => setNewListTitle(event.target.value)}
              onKeyDown={event => event.key === 'Enter' && createList()}
              placeholder="Bermuda, Disney, Hockey Tournament..."
            />
            <button onClick={createList}>Create</button>
          </div>
        </section>
      )}

      {activeList && (
        <section className="packing-card">
          <div className="packing-header">
            <div>
              <div className="eyebrow"><Plane size={15} /> Current list</div>
              <h2>{activeList.emoji} {activeList.title}</h2>
            </div>
            <div className="progress-pill">{packedCount}/{totalCount}</div>
          </div>

          <div className="progress-track" aria-label={`${progress}% packed`}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-label">{progress}% packed</div>

          <div className="add-row">
            <input
              value={newItem}
              onChange={event => setNewItem(event.target.value)}
              onKeyDown={event => event.key === 'Enter' && addItem()}
              placeholder="Add an item..."
            />
            <button onClick={addItem}><Plus size={18} /> Add</button>
          </div>

          <div className="items">
            {activeList.items.length === 0 ? (
              <div className="empty-state">Add your first item above.</div>
            ) : (
              activeList.items.map(item => (
                <div className={`item-row ${item.packed ? 'packed' : ''}`} key={item.id}>
                  <button className="check-button" onClick={() => toggleItem(item.id)} aria-label={`Toggle ${item.name}`}>
                    {item.packed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <span>{item.name}</span>
                  <button className="delete-item" onClick={() => deleteItem(item.id)} aria-label={`Delete ${item.name}`}>
                    <Trash2 size={17} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="actions">
            <button className="secondary" onClick={resetList}><RotateCcw size={17} /> Unpack All</button>
            <button className="secondary" onClick={duplicateList}><Copy size={17} /> Duplicate</button>
            <button className="danger" onClick={deleteList} disabled={lists.length === 1}><Trash2 size={17} /> Delete List</button>
          </div>
        </section>
      )}
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
