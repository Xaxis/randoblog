#!/bin/bash

echo "🔄 Reloading blog content..."

# Method 1: Hit the reload API endpoint
echo "📡 Triggering content refresh via API..."
curl -X POST http://localhost:4322/randoblog/api/reload.json 2>/dev/null

echo ""
echo "✅ Content reload triggered!"
echo ""
echo "🌐 Visit your blog at: http://localhost:4322/randoblog/"
echo ""
echo "💡 If content still looks old, try a hard refresh in your browser:"
echo "   - Chrome/Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)"
echo "   - Or open DevTools → Network tab → check 'Disable cache'"
