import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Firebase
  const firebaseConfig = JSON.parse(await fs.readFile(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);

  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  // Helper to recursively scan for heatmap
  async function scanDirectory(dirPath: string, baseDir: string): Promise<any> {
    const stats = await fs.stat(dirPath);
    const name = path.basename(dirPath) || 'root';
    
    if (stats.isDirectory()) {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const children = await Promise.all(
        entries.map(e => scanDirectory(path.join(dirPath, e.name), baseDir))
      );
      return { name, children, value: children.reduce((acc, c) => acc + (c.value || 0), 0) };
    }
    
    return { name, value: stats.size, type: 'file', extension: path.extname(dirPath).slice(1) };
  }

  app.get("/api/heatmap", async (req, res) => {
    try {
      const targetPath = (req.query.path as string) || ".";
      const absolutePath = path.resolve(process.cwd(), targetPath);
      const data = await scanDirectory(absolutePath, process.cwd());
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate heatmap" });
    }
  });

  // API Route: AI Semantic Search
  app.post("/api/ai/search", async (req, res) => {
    try {
      const { query, currentPath } = req.body;
      const absolutePath = path.resolve(process.cwd(), currentPath || ".");
      
      // 1. Get list of files in context
      const entries = await fs.readdir(absolutePath, { withFileTypes: true });
      const filesContext = await Promise.all(entries.map(async e => {
        const stats = await fs.stat(path.join(absolutePath, e.name));
        return {
          name: e.name,
          type: e.isDirectory() ? 'directory' : 'file',
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
          extension: path.extname(e.name).slice(1)
        };
      }));

      // 2. Ask Gemini to filter based on semantic query
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Given this list of files: ${JSON.stringify(filesContext)}. 
        Filter and return the names of files that match this query: "${query}". 
        Be intelligent: if they ask for "images from last week", check extensions and modified dates.
        Return ONLY a JSON array of matching filenames.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      const matchedNames = JSON.parse(response.text);
      res.json(matchedNames);
    } catch (error) {
      console.error("AI Search Error:", error);
      res.status(500).json({ error: "AI search failed" });
    }
  });

  // API Route: List directory contents
  app.get("/api/files", async (req, res) => {
    try {
      const targetPath = (req.query.path as string) || ".";
      
      if (targetPath.startsWith("cloud://")) {
        const parentPath = targetPath.replace("cloud://", "");
        const q = query(collection(db, "cloud_files"), where("parentPath", "==", parentPath));
        const snapshot = await getDocs(q);
        const files = snapshot.docs.map(docSnapshot => ({
          ...docSnapshot.data(),
          id: `cloud://${docSnapshot.id}`,
        }));
        return res.json(files);
      }

      if (targetPath.startsWith("drive://")) {
        const q = query(collection(db, "cloud_files"), where("parentPath", "==", "drive"));
        const snapshot = await getDocs(q);
        let files: any[] = snapshot.docs.map(d => ({ ...d.data(), id: `drive://${d.id}` }));
        if (files.length === 0) {
          files = [
            { id: "drive://doc1", name: "Project Architecture & Requirements.gdoc", type: "file", size: 45200, extension: "gdoc", lastModified: new Date().toISOString(), path: "drive://doc1" },
            { id: "drive://sheet1", name: "Q3 Console Performance Metrics.gsheet", type: "file", size: 128000, extension: "gsheet", lastModified: new Date().toISOString(), path: "drive://sheet1" },
            { id: "drive://slides1", name: "Xbox Mode Launch Presentation.gslides", type: "file", size: 3400000, extension: "gslides", lastModified: new Date().toISOString(), path: "drive://slides1" },
            { id: "drive://folder1", name: "Shared Team Assets", type: "directory", size: 0, lastModified: new Date().toISOString(), path: "drive://folder1" }
          ];
        }
        return res.json(files);
      }

      if (targetPath.startsWith("photos://")) {
        const q = query(collection(db, "cloud_files"), where("parentPath", "==", "photos"));
        const snapshot = await getDocs(q);
        let files: any[] = snapshot.docs.map(d => ({ ...d.data(), id: `photos://${d.id}` }));
        if (files.length === 0) {
          files = [
            { id: "photos://img1", name: "E3_2026_Keynote_Banner.png", type: "file", size: 2450000, extension: "png", lastModified: new Date().toISOString(), path: "photos://img1" },
            { id: "photos://img2", name: "Console_UI_Dark_Concept.jpg", type: "file", size: 1800000, extension: "jpg", lastModified: new Date().toISOString(), path: "photos://img2" },
            { id: "photos://img3", name: "Hardware_Benchmarking_Rig.png", type: "file", size: 3100000, extension: "png", lastModified: new Date().toISOString(), path: "photos://img3" }
          ];
        }
        return res.json(files);
      }

      if (targetPath.startsWith("dropbox://")) {
        const q = query(collection(db, "cloud_files"), where("parentPath", "==", "dropbox"));
        const snapshot = await getDocs(q);
        let files: any[] = snapshot.docs.map(d => ({ ...d.data(), id: `dropbox://${d.id}` }));
        if (files.length === 0) {
          files = [
            { id: "dropbox://zip1", name: "DirectX12_Graphics_Shaders.zip", type: "file", size: 14500000, extension: "zip", lastModified: new Date().toISOString(), path: "dropbox://zip1" },
            { id: "dropbox://cfg1", name: "Nvidia_MX450_Overclock_Profiles.json", type: "file", size: 4096, extension: "json", lastModified: new Date().toISOString(), path: "dropbox://cfg1" }
          ];
        }
        return res.json(files);
      }

      if (targetPath.startsWith("onedrive://")) {
        const q = query(collection(db, "cloud_files"), where("parentPath", "==", "onedrive"));
        const snapshot = await getDocs(q);
        let files: any[] = snapshot.docs.map(d => ({ ...d.data(), id: `onedrive://${d.id}` }));
        if (files.length === 0) {
          files = [
            { id: "onedrive://docx1", name: "Windows_11_Shell_Replacement_Guide.docx", type: "file", size: 84000, extension: "docx", lastModified: new Date().toISOString(), path: "onedrive://docx1" }
          ];
        }
        return res.json(files);
      }

      const absolutePath = path.resolve(process.cwd(), targetPath);

      // Security check: Don't allow escaping the workspace
      if (!absolutePath.startsWith(process.cwd())) {
        return res.status(403).json({ error: "Access denied" });
      }

      const entries = await fs.readdir(absolutePath, { withFileTypes: true });
      
      const files = await Promise.all(
        entries.map(async (entry) => {
          const entryPath = path.join(targetPath, entry.name);
          const stats = await fs.stat(path.resolve(process.cwd(), entryPath));
          
          return {
            id: entryPath,
            name: entry.name,
            type: entry.isDirectory() ? "directory" : "file",
            size: entry.isFile() ? stats.size : undefined,
            lastModified: stats.mtime.toISOString(),
            extension: entry.isFile() ? path.extname(entry.name).slice(1) : undefined,
            path: entryPath,
          };
        })
      );

      res.json(files);
    } catch (error) {
      console.error("Failed to list files:", error);
      res.status(500).json({ error: "Failed to read directory" });
    }
  });

  app.post("/api/cloud/upload", async (req, res) => {
    try {
      const { localPath, cloudParentPath } = req.body;
      const absolutePath = path.resolve(process.cwd(), localPath);
      
      const stats = await fs.stat(absolutePath);
      const content = stats.isFile() ? await fs.readFile(absolutePath, 'utf-8') : "";
      
      const newFile = {
        name: path.basename(localPath),
        type: stats.isDirectory() ? "directory" : "file",
        size: stats.size,
        content: content.slice(0, 10000), // limit size
        lastModified: stats.mtime.toISOString(),
        extension: path.extname(localPath).slice(1),
        parentPath: cloudParentPath || "root",
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "cloud_files"), newFile);
      res.json({ id: docRef.id, success: true });
    } catch (error) {
      console.error("Cloud upload error:", error);
      res.status(500).json({ error: "Failed to upload to cloud" });
    }
  });

  // API Route: Get preview for a file or directory
  app.get("/api/preview", async (req, res) => {
    try {
      const targetPath = req.query.path as string;
      if (!targetPath) return res.status(400).json({ error: "Path required" });
      
      const absolutePath = path.resolve(process.cwd(), targetPath);
      if (!absolutePath.startsWith(process.cwd())) {
        return res.status(403).json({ error: "Access denied" });
      }

      const stats = await fs.stat(absolutePath);

      if (stats.isDirectory()) {
        const entries = await fs.readdir(absolutePath, { withFileTypes: true });
        const items = entries.slice(0, 5).map(e => ({ name: e.name, type: e.isDirectory() ? 'directory' : 'file' }));
        return res.json({ type: 'directory', items, total: entries.length });
      } else {
        const ext = path.extname(targetPath).toLowerCase();
        const textExtensions = ['.txt', '.md', '.json', '.js', '.ts', '.tsx', '.css', '.html', '.env', '.example'];
        
        if (textExtensions.includes(ext)) {
          const content = await fs.readFile(absolutePath, 'utf-8');
          return res.json({ type: 'text', content: content.slice(0, 1000) });
        }
        
        return res.json({ type: 'other' });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get preview" });
    }
  });


  // API Route: Get raw file
  app.get("/api/raw", async (req, res) => {
    try {
      const targetPath = req.query.path as string;
      if (!targetPath) return res.status(400).json({ error: "Path required" });
      
      const absolutePath = path.resolve(process.cwd(), targetPath);
      if (!absolutePath.startsWith(process.cwd())) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const stats = await fs.stat(absolutePath);
      if (stats.isDirectory()) {
        return res.status(400).json({ error: "Cannot read directory" });
      }
      
      res.sendFile(absolutePath);
    } catch (error) {
      res.status(500).json({ error: "Failed to get file" });
    }
  });

  // Vite middleware
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nexus File Explorer running at http://localhost:${PORT}`);
  });
}

startServer();
