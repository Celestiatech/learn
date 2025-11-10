import fs from 'fs'
import path from 'path'

const DB = path.join(process.cwd(), 'data', 'progress.json')

function ensure(){
  const dir = path.dirname(DB)
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if(!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({ users: {}, progress: {} }, null, 2))
}

export function readStore(){
  ensure()
  const raw = fs.readFileSync(DB, 'utf-8')
  return JSON.parse(raw)
}

export function writeStore(obj: any){
  ensure()
  fs.writeFileSync(DB, JSON.stringify(obj, null, 2))
}

export function createAnonUser(){
  const store = readStore()
  const id = 'anon_' + Math.random().toString(36).slice(2,10)
  store.users[id] = { id, anonymous: true, createdAt: new Date().toISOString() }
  writeStore(store)
  return id
}

export function getProgressForUser(userId: string){
  const store = readStore()
  return store.progress[userId] || []
}

export function upsertProgress(userId: string, track: string, lesson: string){
  const store = readStore()
  store.progress[userId] = store.progress[userId] || []
  const exists = store.progress[userId].find((p: any)=>p.track===track && p.lesson===lesson)
  if(!exists) store.progress[userId].push({ track, lesson, completed: true, updatedAt: new Date().toISOString() })
  else exists.completed = true
  writeStore(store)
  return store.progress[userId]
}
