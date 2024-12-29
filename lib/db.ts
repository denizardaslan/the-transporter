import Database from 'better-sqlite3';
import { join } from 'path';

// Initialize database
const db = new Database(join(process.cwd(), 'driving-data.db'));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT
  )
`);

export interface FileRecord {
  id: number;
  name: string;
  content: string;
  uploadDate: string;
  metadata?: string;
}

export function insertFileData(
  filename: string,
  content: string,
  metadata?: string
): number {
  const stmt = db.prepare(
    'INSERT INTO files (name, content, metadata) VALUES (?, ?, ?)'
  );
  const result = stmt.run(filename, content, metadata || null);
  return result.lastInsertRowid as number;
}

export function getAllFiles(): FileRecord[] {
  const stmt = db.prepare('SELECT * FROM files ORDER BY uploadDate DESC');
  return stmt.all() as FileRecord[];
}

export function getFileById(id: number): FileRecord | undefined {
  const stmt = db.prepare('SELECT * FROM files WHERE id = ?');
  return stmt.get(id) as FileRecord | undefined;
}

export function deleteFileById(id: number): boolean {
  const stmt = db.prepare('DELETE FROM files WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function updateFileName(id: number, newName: string): boolean {
  const stmt = db.prepare('UPDATE files SET name = ? WHERE id = ?');
  const result = stmt.run(newName, id);
  return result.changes > 0;
} 