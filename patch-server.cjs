const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');

const rawRoute = `
  // API Route: Get raw file
  app.get("/api/raw", async (req, res) => {
    try {
      const targetPath = req.query.path;
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
`;

const updated = content.replace('  // Vite middleware for development', rawRoute + '  // Vite middleware for development');
fs.writeFileSync('server.ts', updated);
