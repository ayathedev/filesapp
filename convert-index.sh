#!/bin/bash
sed -i 's/bg-\[#0c0c0c\]/bg-slate-50/g' src/index.css
sed -i 's/text-slate-200/text-slate-900/g' src/index.css
sed -i 's/ring-offset-\[#0c0c0c\]/ring-offset-slate-50/g' src/index.css
sed -i 's/box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);/box-shadow: none;/g' src/index.css
sed -i 's/scale-\[1.02\]//g' src/index.css
sed -i 's/bg-white\/10/bg-slate-300/g' src/index.css
sed -i 's/bg-white\/20/bg-slate-400/g' src/index.css
sed -i 's/bg-white\/5/bg-slate-100/g' src/index.css
sed -i 's/border-white\/5/border-slate-200/g' src/index.css
