#!/bin/bash
find src -type f -name "*.tsx" | while read -r file; do
  sed -i 's/bg-\[#0c0c0c\]/bg-slate-50/g' "$file"
  sed -i 's/bg-slate-900\/50/bg-white/g' "$file"
  sed -i 's/bg-slate-900\/30/bg-white\/90/g' "$file"
  sed -i 's/bg-slate-900\/60/bg-slate-50/g' "$file"
  sed -i 's/bg-slate-900\/80/bg-white\/90/g' "$file"
  sed -i 's/bg-slate-900\/90/bg-white\/95/g' "$file"
  sed -i 's/bg-slate-900/bg-white/g' "$file"
  
  sed -i 's/border-white\/5/border-slate-200/g' "$file"
  sed -i 's/border-white\/10/border-slate-200/g' "$file"
  sed -i 's/border-white\/15/border-slate-300/g' "$file"
  
  sed -i 's/text-slate-100/text-slate-900/g' "$file"
  sed -i 's/text-slate-200/text-slate-800/g' "$file"
  sed -i 's/text-slate-400/text-slate-600/g' "$file"
  sed -i 's/text-slate-300/text-slate-700/g' "$file"
  
  sed -i 's/hover:bg-white\/5/hover:bg-slate-200/g' "$file"
  sed -i 's/hover:bg-white\/10/hover:bg-slate-300/g' "$file"
  
  sed -i 's/bg-white\/5/bg-slate-100/g' "$file"
  sed -i 's/bg-white\/10/bg-slate-200/g' "$file"
  
  sed -i 's/bg-black\/80/bg-slate-900\/50/g' "$file"
  sed -i 's/bg-black\/40/bg-white\/80/g' "$file"
  sed -i 's/bg-black\/85/bg-slate-900\/50/g' "$file"
  sed -i 's/bg-black\/90/bg-slate-900\/60/g' "$file"
  
  sed -i 's/bg-blue-600\/20/bg-blue-100/g' "$file"
  sed -i 's/text-blue-400/text-blue-700/g' "$file"
  sed -i 's/border-blue-500\/30/border-blue-200/g' "$file"
  sed -i 's/ring-blue-500\/40/ring-blue-300/g' "$file"
  sed -i 's/shadow-blue-600\/20/shadow-blue-200/g' "$file"
  sed -i 's/shadow-blue-600\/30/shadow-blue-200/g' "$file"
  
  sed -i 's/bg-emerald-500\/20/bg-emerald-100/g' "$file"
  sed -i 's/text-emerald-400/text-emerald-700/g' "$file"
  sed -i 's/border-emerald-500\/30/border-emerald-200/g' "$file"
  sed -i 's/shadow-emerald-600\/20/shadow-emerald-200/g' "$file"
  sed -i 's/text-emerald-300/text-emerald-700/g' "$file"
  
  sed -i 's/bg-purple-500\/20/bg-purple-100/g' "$file"
  sed -i 's/text-purple-400/text-purple-700/g' "$file"
  sed -i 's/border-purple-500\/30/border-purple-200/g' "$file"
  sed -i 's/text-purple-300/text-purple-700/g' "$file"
done
