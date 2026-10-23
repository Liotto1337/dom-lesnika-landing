#!/usr/bin/env bash
# Downloads the stock photos used on the page into public/images/.
# All photos are from Unsplash (Unsplash License: free to use, attribution not required).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/images

fetch() { # <file> <unsplash-photo-id>
  curl -sfL -o "public/images/$1.jpg" "https://images.unsplash.com/photo-$2?w=1400&q=72&fm=jpg&fit=max"
  echo "ok $1"
}

fetch about-cabin      1449158743715-0a90ebb6d2d8
fetch about-lake       1439066615861-d1af74d74000
fetch about-campfire   1478131143081-80f7f84ca84d
fetch cabin-aframe     1595521624992-48a59aef95e3
fetch cabin-family     1587061949409-02df41d5e562
fetch cabin-couple     1542718610-a1d656d1884c
fetch cabin-lodge      1510798831971-661eb04b3739
fetch act-sauna        1583416750470-965b2707b355
fetch act-boat         1476514525535-07fb3b4ae5f1
fetch act-bbq          1555939594-58d7cb561ad1
fetch act-fishing      1545450660-3378a7f3a364
fetch act-trails       1586375300773-8384e3e4916f
fetch act-winter       1483664852095-d6cc6870702d
