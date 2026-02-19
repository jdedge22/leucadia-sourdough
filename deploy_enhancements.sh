#!/bin/bash

echo "🍞 LEUCADIA SOURDOUGH - ENHANCEMENT DEPLOYMENT"
echo "=============================================="
echo ""

# Verify directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root"
    exit 1
fi

# Check images
echo "📸 Checking for images..."
mkdir -p public/images
IMAGE_COUNT=$(ls public/images/*.jpg 2>/dev/null | wc -l)
if [ "$IMAGE_COUNT" -lt 4 ]; then
    echo "⚠️  Found only $IMAGE_COUNT images"
    echo "Please add these to public/images/:"
    echo "  - bread-sliced-warm-light.jpg"
    echo "  - bread-sliced-butter-lifestyle.jpg"
    echo "  - two-loaves-artisan-craft.jpg"
    echo "  - avocado-toast-lifestyle.jpg"
    read -p "Press Enter after adding images..."
fi

# Backup
echo "💾 Backing up..."
cp src/app/page.tsx src/app/page.tsx.backup
cp src/app/checkout/page.tsx src/app/checkout/page.tsx.backup

echo "🏠 Updating homepage..."
# I'll continue in next message - files are too large for single cat

